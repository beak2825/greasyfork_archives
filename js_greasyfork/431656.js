// ==UserScript==
// @name         Neopets: Shops tracker
// @author       Tombaugh Regio
// @version      1.0
// @description  What it says on the tin
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/shops/
// @match        http://www.neopets.com/*obj_type=*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.xmlHttpRequest
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/431656/Neopets%3A%20Shops%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/431656/Neopets%3A%20Shops%20tracker.meta.js
// ==/UserScript==

//====================================

//List the exact items that you want to show. Spelling and capitalization matters!
const SHOPS_DIRECTORY = [
  {
    name: "Neopian Fresh Foods",
    url: 1,
    blackMarket: [],
    r99: [
      "Rainbow Carrot", "Puzzle Fruit", "Plum"
    ],
    r95: [
      "Christmas Pattern Negg", "Pretty Purple Princess Negg", "Blue Cybunny Negg", "Cheesy Chokato Pie", "Blue Picnic Hamper", "Pirate Negg", 
      "Fun Icy Cheese Pop", "Tigersquash Custard", "Chokato Toffee Apple", "Cheesy Strawberry Slice", "Cheesy Carrot Chunks", "Steak Surprise", 
      "Black Caviar", "Rainbow Neggnog", "Mega Pipper Sandwich", "Island Meatloaf", "Mutated Negg", "Zeenana Toffee Apple", "Acara Ice Cream Surprise", 
      "Bangers and Mash", "Rainbow Negg", "Mega Manoroot Sandwich", "Meerca Apertif", "Flaming Tuskaninny Ice Cream", "Frozen Veggie Delight", 
      "Cybunny Day Canape", "Ice Apple", "Fire Apple", "Lenny Salad", "Seaweed Flotsam Burger", "Red Picnic Hamper", "Mega Tuna Sandwich", 
      "Grey Eggs and Bacon", "Glowing Apple", "Green Ham"
    ],
    r90: [
      "Container of Purple Liquid", "Upside Down Ice Cream", "Rainbow Apple", "Grey Toast", "Tchea Toffee Apple", "Le Sausage", "Honey and Bacon Burger", 
      "Raspberry Toffee Apple", "Funnydew Neggnog", "Starry Scorchipepper", "Chilli Salmon Souffle", "Battle Duck Negg", "Chokato Neggnog", "Starry Cupcake", 
      "Welsh Rarebit", "Cawl", "Heart Shaped Negg", "Kau Waffles", "Tasty Guacamole", "Peach Jelly", "Square Meat", "Lutari Fizz", "Super Icy Custard", 
      "Ruki Salad", "Petpet Crackers", "Puntec Parcel", "Fire Carrot", "Steak Negg", "Mynci Surprise Ice Cream", "Raspberry Jam", "Peanut Dash Stir Fry", 
      "Deluxe Peophin Burger", "Flotsam Fin Soup", "Rock Negg", "JubJub Coconut Juice", "Maple Syrup Negg", "Chocolate Shoyru Meatball", "Twin Salad", 
      "Fruit Tart", "Noil Candy Floss", "Flied Rice", "Unripe Puntec Wrap", "Watermelon Roll", "Squibble Berry Sandwich", "Grey Waffles", "Purple Carrot", 
      "Cybunny Carrot Stew", "Meerca Bolognese", "Turkey Drumstick Dinner", "Buzz Sandwich", "Thistleberry Sandwich", "Baby Elephante Milk Bottle", 
      "Nimmo Day Fruit Cake", "Buzz Bread Salad", "Techo Jelly Surprise", "Continuous Meat", "Cookie Negg", "Mynci Fruit Kebab", "Grapeade", 
      "Seasoned Curly Chips", "Roast Chestnut Neggnog", "Kau Ice Lolly", "Chocolate Kau Milk"
    ],
    r85: [
      "Speckled Negg", "Purple Cybunny Negg", "Candy Cane Negg", "Sweet and Sour Negg", "Decorative Negg", "Ultra Icy Negg", "Ornate Purple Negg", 
      "Blue Negg", "Pink Negg", "Glass Negg", "Orange Negg", "Happy Birthday Negg", "Grey Cheese"
    ],
    r1: [
      "Yellow Negg", "Purple Negg", "Partitioned Negg", "Bag of Peanuts", "Swirly Negg #498", "Super Icy Negg", "Lemon Swirly Negg", "Lime Swirly Negg", 
      "Green Negg", "Orange Jetsam Cupcake", "Cheese and Tonu Crackers", "Chocolate Elephante Doughnut", "Chocolate Poogle Cupcake", "Gruel Sandwich", 
      "Wormy Jam Sandwich", "Taco Salad", "Plain Shoyru Meatball", "Gnome Crunch", "Freeze Dried Sausage", "Lutical Berries", "Turkey Curry", 
      "Strawberry Achyfi", "Chocolate Ice Cream"
        ]
  },
  {
    name: "Kauvara's Magic Shop",
    url: 2,
    blackMarket: [],
    r99: [
      "Plushie Cybunny Morphing Potion", "Plushie Aisha Morphing Potion", "Maraquan Gelert Morphing Potion", "Strange Potion", "Darigan Eyrie Morphing Potion", 
      "Maraquan Acara Morphing Potion", "Plushie Bruce Morphing Potion", "Grey JubJub Morphing Potion", "Halloween Kyrii Morphing Potion", 
      "Baby Kacheek Morphing Potion", "Halloween Blumaroo Morphing Potion", "Darigan Wocky Morphing Potion", "Desert Aisha Morphing Potion", 
      "Darigan Ixi Morphing Potion", "Plushie Kiko Morphing Potion", "Grey Ixi Morphing Potion", "Plushie Skeith Morphing Potion", 
      "Faerie Lupe Morphing Potion", "Faerie Ixi Morphing Potion", "Blue Krawk Morphing Potion", "Faerie Blumaroo Morphing Potion", 
      "Plushie Bori Morphing Potion", "Plushie Korbat Morphing Potion", "Faerie Shoyru Morphing Potion", "Rainbow Swirly Potion", "Baby Lupe Morphing Potion", 
      "Kauvaras Potion", "Island Lenny Morphing Potion", "Green Gelert Morphing Potion", "Yellow Kacheek Morphing Potion", "Blue Kacheek Morphing Potion", 
      "Plushie Usul Morphing Potion", "Desert Blumaroo Morphing Potion", "Spotted Gelert Morphing Potion", "Island Cybunny Morphing Potion", 
      "Baby Aisha Morphing Potion", "Faerie Usul Morphing Potion", "Darigan Blumaroo Morphing Potion", "Island Peophin Morphing Potion", 
      "Baby Scorchio Morphing Potion", "Desert Ixi Morphing Potion", "Baby Kau Morphing Potion", "Red Draik Morphing Potion", "Rainbow Lupe Morphing Potion", 
      "Rainbow Hissi Morphing Potion", "Spotted Kau Morphing Potion", "Baby Korbat Morphing Potion", "Red Jetsam Morphing Potion", 
      "Yellow Lupe Morphing Potion", "Disco Kacheek Morphing Potion", "Fire Draik Morphing Potion", "Yellow Gelert Morphing Potion", 
      "Baby Chomby Morphing Potion", "Shadow Blumaroo Morphing Potion", "Spotted Kougra Morphing Potion", "Baby Meerca Morphing Potion", 
      "Red Gelert Morphing Potion", "Plushie Chomby Morphing Potion", "Fire Lupe Morphing Potion", "Green Krawk Morphing Potion", "Baby Bruce Morphing Potion", 
      "Blue Gelert Morphing Potion", "Faerie JubJub Morphing Potion", "Darigan Zafara Morphing Potion", "Yellow Jetsam Morphing Potion", 
      "Red Kacheek Morphing Potion", "Pirate Kacheek Morphing Potion", "Baby Uni Morphing Potion", "Halloween Korbat Morphing Potion", 
      "Ghost Draik Morphing Potion", "Shadow Ruki Morphing Potion", "Island Blumaroo Morphing Potion", "Darigan Bori Morphing Potion", 
      "Baby Gnorbu Morphing Potion", "Blue Cybunny Morphing Potion", "Electric Ixi Morphing Potion", "Maraquan Korbat Morphing Potion", 
      "Faerie Acara Morphing Potion", "Ghost Gelert Morphing Potion", "Shadow Peophin Morphing Potion", "Invisible Wocky Morphing Potion", 
      "Baby Acara Morphing Potion", "Cloud Cybunny Morphing Potion", "Grey Zafara Morphing Potion", "Rainbow Chomby Morphing Potion", 
      "Purple Draik Morphing Potion", "Grey Techo Morphing Potion", "Yellow Zafara Morphing Potion", "Grey Grarrl Morphing Potion", 
      "Fire Chomby Morphing Potion", "Green Draik Morphing Potion", "Ghost Hissi Morphing Potion", "Plushie Tuskaninny Morphing Potion", 
      "Fire Kacheek Morphing Potion", "Darigan Grarrl Morphing Potion", "Maraquan Mynci Morphing Potion", "Green Lupe Morphing Potion", 
      "Plushie Kau Morphing Potion", "Plushie Grundo Morphing Potion", "Yellow Krawk Morphing Potion", "White Chomby Morphing Potion", 
      "Disco Shoyru Morphing Potion", "Striped Xweetok Morphing Potion", "Starry Draik Morphing Potion", "Plushie Flotsam Morphing Potion", 
      "Spotted Jetsam Morphing Potion", "Shadow Chomby Morphing Potion", "Darigan Kyrii Morphing Potion", "Spotted Koi Morphing Potion", 
      "Faerie Meerca Morphing Potion", "Plushie Yurble Morphing Potion", "Brown Ixi Morphing Potion", "Darigan Acara Morphing Potion", 
      "Island Grundo Morphing Potion", "Pirate Poogle Morphing Potion", "Christmas Ixi Morphing Potion", "Darigan Grundo Morphing Potion", 
      "Grey Yurble Morphing Potion", "Snow Usul Morphing Potion", "Pirate Wocky Morphing Potion", "Blue Peophin Morphing Potion", "Yellow Kiko Morphing Potion", 
      "Red Peophin Morphing Potion", "Plushie Techo Morphing Potion", "Blue Kiko Morphing Potion", "Green Zafara Morphing Potion", 
      "Purple Eyrie Morphing Potion", "Shadow Lenny Morphing Potion", "Pirate Lenny Morphing Potion", "Purple Grundo Morphing Potion", 
      "Purple Peophin Morphing Potion", "Blue Wocky Morphing Potion", "Red Kau Morphing Potion", "Electric Grarrl Morphing Potion", 
      "Blue Korbat Morphing Potion", "Green Chia Morphing Potion", "Christmas Kougra Morphing Potion", "Red Kiko Morphing Potion", 
      "Rainbow JubJub Morphing Potion", "Checkered Acara Morphing Potion", "Blue Acara Morphing Potion", "Island Kiko Morphing Potion", 
      "Yellow Acara Morphing Potion", "Purple Shoyru Morphing Potion", "Christmas Grundo Morphing Potion", "Red Chia Morphing Potion", 
      "Christmas Blumaroo Morphing Potion", "Island Skeith Morphing Potion", "Island Korbat Morphing Potion", "Blue Chia Morphing Potion", 
      "Green Acara Morphing Potion", "Fire Acara Morphing Potion", "Island Eyrie Morphing Potion", "Red Acara Morphing Potion", 
      "Strawberry Techo Morphing Potion", "Snow Blumaroo Morphing Potion", "Red Korbat Morphing Potion", "Christmas Bruce Morphing Potion", 
      "Starry Grundo Morphing Potion", "Christmas Magic Hat", "Island Shoyru Morphing Potion", "Blue Shoyru Morphing Potion", "Striped Kau Morphing Potion", 
      "Fire Ixi Morphing Potion", "Island Wocky Morphing Potion", "Fire Wocky Morphing Potion", "Ghost Acara Morphing Potion", "Red Bruce Morphing Potion", 
      "Ghost Shoyru Morphing Potion", "Snow Bori Morphing Potion", "Yellow Wocky Morphing Potion", "Green Korbat Morphing Potion", "Red Eyrie Morphing Potion", 
      "Ghost Grarrl Morphing Potion", "Rainbow Flotsam Morphing Potion", "Red Flotsam Morphing Potion", "White Flotsam Morphing Potion", 
      "Checkered Kiko Morphing Potion", "Green Usul Morphing Potion", "Snow Bruce Morphing Potion", "Blue Usul Morphing Potion", "Skunk Eyrie Morphing Potion", 
      "Blue Bori Morphing Potion", "Fire Ruki Morphing Potion", "Yellow Grundo Morphing Potion", "Rainbow Kau Morphing Potion", 
      "Rainbow Wocky Morphing Potion", "Christmas Wocky Morphing Potion", "Green Kau Morphing Potion", "Blue Kau Morphing Potion", 
      "Starry Skeith Morphing Potion", "Cloud Shoyru Morphing Potion", "Halloween Kau Morphing Potion", "Snow Aisha Morphing Potion", 
      "Fire Techo Morphing Potion", "Water Faerie Bubbles", "Yellow Usul Morphing Potion", "Cloud Ruki Morphing Potion", "Yellow Blumaroo Morphing Potion", 
      "Fire Skeith Morphing Potion", "Fire Quiggle Morphing Potion", "Blue Lenny Morphing Potion", "Starry Kau Morphing Potion", 
      "Glowing Korbat Morphing Potion", "Red Koi Morphing Potion", "Yellow Bori Morphing Potion", "Blue Kougra Morphing Potion", 
      "Snow Wocky Morphing Potion", "Green Blumaroo Morphing Potion", "Fire Yurble Morphing Potion", "Starry Eyrie Morphing Potion", 
      "Green Lenny Morphing Potion", "Yellow Korbat Morphing Potion", "Fire Bruce Morphing Potion", "Green Moehog Morphing Potion", 
      "Disco Bruce Morphing Potion", "Snow Eyrie Morphing Potion", "Yellow Lenny Morphing Potion", "Green Skeith Morphing Potion", 
      "Cloud Bruce Morphing Potion", "Ghost Lenny Morphing Potion", "Blue Skeith Morphing Potion", "Flaming Torch", "White Chia Morphing Potion", 
      "Ghost Korbat Morphing Potion", "Red Grarrl Morphing Potion", "Tyrannian Flotsam Morphing Potion", "Disco Moehog Morphing Potion", 
      "Blue Blumaroo Morphing Potion", "Ghost Peophin Morphing Potion", "Blue Koi Morphing Potion", "Christmas Korbat Morphing Potion", 
      "Checkered Aisha Morphing Potion", "Red Bori Morphing Potion", "Striped Skeith Morphing Potion", "Skunk Flotsam Morphing Potion", 
      "Green Bori Morphing Potion", "Blue Grarrl Morphing Potion", "Island Techo Morphing Potion", "Christmas JubJub Morphing Potion", 
      "Split Bruce Morphing Potion", "Green Tuskaninny Morphing Potion", "White Skeith Morphing Potion", "Yellow Poogle Morphing Potion",
      "Ghost Tuskaninny Morphing Potion", "Purple Tonu Morphing Potion", "Green Peophin Morphing Potion", "Red Kougra Morphing Potion", 
      "Spotted Pteri Morphing Potion", "Green Flotsam Morphing Potion", "Red Wocky Morphing Potion", "Green Koi Morphing Potion", "Fire Moehog Morphing Potion", 
      "Yellow Buzz Morphing Potion", "Blue Quiggle Morphing Potion", "Faerie Tuskaninny Morphing Potion", "Christmas Scorchio Morphing Potion", 
      "Strawberry Tuskaninny Morphing Potion", "Yellow Skeith Morphing Potion", "Desert Scorchio Morphing Potion", "Green Pteri Morphing Potion", 
      "Yellow Moehog Morphing Potion", "Red Lenny Morphing Potion", "Red Yurble Morphing Potion", "Ghost Techo Morphing Potion", "Green Grarrl Morphing Potion",
      "Electric Moehog Morphing Potion", "Green Meerca Morphing Potion", "Red Mynci Morphing Potion", "Yellow Elephante Morphing Potion", 
      "Red Kyrii Morphing Potion", "Striped Flotsam Morphing Potion", "Green Kougra Morphing Potion", "Striped Nimmo Morphing Potion", 
      "Yellow Mynci Morphing Potion", "Orange Yurble Morphing Potion", "Yellow Grarrl Morphing Potion", "Spotted Flotsam Morphing Potion", 
      "Yellow Koi Morphing Potion", "Fire Buzz Morphing Potion", "Green Techo Morphing Potion", "Starry Yurble Morphing Potion"
    ],
    r95: [
      "Pink Draik Morphing Potion", "Cloud Gelert Morphing Potion", "White Xweetok Morphing Potion", "Blue Lupe Morphing Potion", 
      "Christmas Cybunny Morphing Potion", "Rainbow Cybunny Morphing Potion", "Yellow Cybunny Morphing Potion", "Rainbow Kacheek Morphing Potion", 
      "Red Krawk Morphing Potion", "Skunk Draik Morphing Potion", "Green Cybunny Morphing Potion", "Split Lupe Morphing Potion", "Blue Jetsam Morphing Potion", 
      "Green Shoyru Morphing Potion", "Rainbow Grarrl Morphing Potion", "Yellow Ixi Morphing Potion", "Purple Zafara Morphing Potion", 
      "Green Ixi Morphing Potion", "Island Usul Morphing Potion", "Blue Ixi Morphing Potion", "Silver Peophin Morphing Potion", "Brown Aisha Morphing Potion", 
      "Purple Aisha Morphing Potion", "Green Kiko Morphing Potion", "Green Ruki Morphing Potion", "Glowing Lupe Morphing Potion", 
      "Yellow Peophin Morphing Potion", "Disco Acara Morphing Potion", "Starry Usul Morphing Potion", "Island Acara Morphing Potion", 
      "Green Chomby Morphing Potion", "Cloud Acara Morphing Potion", "Starry Ruki Morphing Potion", "White Shoyru Morphing Potion", 
      "Purple Chia Morphing Potion", "Blue Ruki Morphing Potion", "Red Ruki Morphing Potion", "Brown Ruki Morphing Potion", "Red Lupe Morphing Potion", 
      "Blue Chomby Morphing Potion", "Pink Korbat Morphing Potion", "Pink Shoyru Morphing Potion", "Red Chomby Morphing Potion", 
      "Speckled Shoyru Morphing Potion", "Yellow Shoyru Morphing Potion", "Silver Shoyru Morphing Potion", "Pink Eyrie Morphing Potion", 
      "Yellow Ruki Morphing Potion", "Green Grundo Morphing Potion", "Pink Kyrii Morphing Potion", "Yellow Chomby Morphing Potion", 
      "Red Hissi Morphing Potion", "Pirate Chomby Morphing Potion", "Blue Hissi Morphing Potion", "Yellow Aisha Morphing Potion", 
      "Checkered Shoyru Morphing Potion", "White Kyrii Morphing Potion", "Cloud Grundo Morphing Potion", "Shadow Shoyru Morphing Potion", 
      "Brown Grundo Morphing Potion", "Pink Ogrin Morphing Potion", "Blue Poogle Morphing Potion", "Rainbow Uni Morphing Potion", "Starry Bori Morphing Potion", 
      "Rainbow Poogle Morphing Potion", "Purple Poogle Morphing Potion", "Pink Koi Morphing Potion", "Gold Shoyru Morphing Potion", 
      "Striped Ixi Morphing Potion", "Cloud Wocky Morphing Potion", "Speckled Bori Morphing Potion", "Skunk Kyrii Morphing Potion", 
      "Rainbow Ogrin Morphing Potion", "Red Scorchio Morphing Potion", "Starry Uni Morphing Potion", "Spotted Grundo Morphing Potion", 
      "Spotted Shoyru Morphing Potion", "Spotted Korbat Morphing Potion", "Striped Korbat Morphing Potion", "Starry Shoyru Morphing Potion", 
      "Green Yurble Morphing Potion", "Striped Aisha Morphing Potion", "Brown Lenny Morphing Potion", "Blue Yurble Morphing Potion", 
      "Red Tonu Morphing Potion", "Striped Blumaroo Morphing Potion", "Striped Scorchio Morphing Potion", "Fire Grarrl Morphing Potion", 
      "Red Aisha Morphing Potion", "Split Lenny Morphing Potion", "Yellow Pteri Morphing Potion", "Yellow JubJub Morphing Potion", 
      "Yellow Kougra Morphing Potion", "Blue Eyrie Morphing Potion", "Starry Xweetok Morphing Potion", "Cloud Pteri Morphing Potion", 
      "Yellow Tonu Morphing Potion", "Starry Wocky Morphing Potion", "Spotted Blumaroo Morphing Potion", "Camouflage Scorchio Morphing Potion", 
      "Brown Kougra Morphing Potion", "Purple Yurble Morphing Potion", "Starry Pteri Morphing Potion", "Checkered Koi Morphing Potion", 
      "Yellow Yurble Morphing Potion", "Red Quiggle Morphing Potion", "Red Tuskaninny Morphing Potion", "Starry Koi Morphing Potion", 
      "Gold Scorchio Morphing Potion", "Spotted Scorchio Morphing Potion", "Brown Techo Morphing Potion", "Yellow Quiggle Morphing Potion", 
      "Yellow Tuskaninny Morphing Potion", "Blue JubJub Morphing Potion", "Spotted Eyrie Morphing Potion", "Skunk Mynci Morphing Potion", 
      "Green Aisha Morphing Potion"
    ],
    r90: [],
    r85: [],
    r1: [
      "Blue Pteri Morphing Potion"
    ]
  },
  {
    name: "Toy Shop",
    url: 3,
    blackMarket: [],
    r99: [
      "Vanity Doll", "Water Faerie Doll", "Fire Faerie Doll", "Amazing Lenny Cracker", "Clock", "Red Skateboard", "Snot Slingshot", "Mutant Golf Club"
    ],
    r95: [
      "Illusen Faerie Doll", "Spite Doll", "A Grey Faerie Doll", "Luxury Dark and Light Faerie Snowglobe", "Luxury Dark and Earth Faerie Snowglobe", 
      "Malice Doll", "Soup Faerie Snowglobe", "Negg Faerie Snowglobe", "Luxury Beach Scene Faerie Snowglobe", "Siyana Doll", "Cool Purple Teddy Bear", 
      "Blue Scorchio Paddleball Game", "Darblat Racer", "Shoyru Neocheckers", "Pretty Princess Quiguki", "Blue Turtum Ball", "Wind Up Shadow Draik", 
      "NeoQuest II The Board Game", "White Bike", "Battle Faerie Action Figure", "Silver Scooter", "Altador Golf Club", "Puppyblew Balloon", "Red Bike", 
      "Lilian Quiguki"
    ],
    r90: [
      "Psellia Doll", "Blue PaintBrush Collectable Charm", "Candy Cane Stocking", "Snowflake Stocking", "Starry Stocking", "Patched Stocking", 
      "Faerie Queen Snowglobe", "Earth Faerie Snowglobe", "Jhudora Bobblehead", "Uni Shoe Throwing Game", "Halloween Kiko Balloon", "Painted Pull Along Scarab", 
      "Shiny Blue Wocky Flying Disc", "Darigan Aisha Action Figure", "Gelert Yoyo", "Kacheek Gnome Making Kit", "Origami Kadoatie", "Purple Korbat Kite", 
      "Air Faerie Charm", "Chuckles Pinata", "Ona Puppet", "Skull and Eye Toy", "Wind Up Green Draik Toy", "Colourful Charms - Set 2"
    ],
    r85: [],
    r1: [
      "Usukicon Y10 Gift Bag", "Usukicon Y9 Gift Bag", "Year 10 Goodie Bag", "Usukicon Y11 Gift Bag", "Neopets 9th Birthday Goodie Bag", 
      "Neopets 8th Birthday Goodie Bag", 
    ]
  },
  {
    name: "Unis Clothing Shop",
    url: 4,
    blackMarket: [],
    r99: [
      "Yellow Zebba T-Shirt", "I Love Khamette T-Shirt", "Krawk T-Shirt", "I Love Buzzer T-Shirt", "Yellow Ramosan T-Shirt", "I Love Chezzoom T-Shirt", 
      "Blue Khonsu T-Shirt", "I Love Hornsby T-Shirt", "Erisim T-Shirt", "Pink Kadoatie T-Shirt", "Yellow Avabot T-Shirt", "I Love Lyins T-Shirt", 
      "I Love Tenna T-Shirt", "I Love Selket T-Shirt", "Pink Walein T-Shirt", "Blue Bogie T-Shirt", "I Love Wadjet T-Shirt", 
      "I got taxed by the Tax Beast T-Shirt"
    ],
    r95: [
      "Snowy Xweetok Dress", "Ixi Forest Cape", "Shoyru Pink Aviator Trousers", "Xweetok Popstar Dress", "Pretty Spring Cybunny Dress", "Alien Aisha Ears", 
      "Rainbow Chomby Dress", "Bionic Cybunny Cranium Cover", "Poogle Wizard Hat", "Kyrii Mage Cape", "Bone Print Gelert Sweater", "Bori Rainbow Dress", 
      "Purple Krawk Cloak", "Rocket Shoyru Rocket Pack", "Winter Zafara Tail Sock", "Rocket Shoyru Helmet", "Kiko Space Exploration Helmet",
      "Draik Archer Trousers", "Pink Flowered Kougra Dress", "Usul Ski Goggles", "Lutari Band Leader Jacket", "Kougra Adventurer Hat", "Draik Archer Quiver", 
      "Kauboy Hat", "Ferocious Negg Suit", "Gelert Spy Jacket", "Grundo Space Belt", "Winter Zafara Parka", "Gelert Spy Shirt", "Kougra Space Suit", 
      "Shoyru Yellow Flower Dress", "Bori Gnome Beard", "Pink Krawk Hair", "Futuristic Lutari Diving Helmet", "Milk Maid Kau Blouse", "Purple Lutari Cloche", 
      "Ruffled Draik Bonnet", "Peophin Desperado Mask", "Blue Tonu Tuxedo Jacket", "Ruki Safety Vest", "Cobrall Charming Hissi Shirt", 
      "Pretty Purple Lutari Dress", "Lacy Poogle Sleeping Gown", "Pink Pyjama Wocky Top", "Poogle Witch Doctor Mask", "Golden Acara Headpiece", 
      "Korbat Aviator Helmet", "Dapper Shoyru Shirt and Coat", "Patched Nimmo Overalls", "Orange Bori Dress", "Blumaroo Jester Hat", "Usul Beatnik Outfit", 
      "Nurse Gelert Dress", "Bruce Tuxedo Jacket", "Red Hood Chia Cape", "Flotsam Spy Jacket", "Red Lenny Vest and Shirt", "Shipwrecked Techo Shorts", 
      "Checkered Moehog Dress", "Ruki Scientist Hat", "Chomby Sleuth Coat", "Maractite Koi Armour", "Nimmo Adventurer Jacket", "Red Hood Chia Dress", 
      "Scorchio Peasant Girl Shirt", "Chia Chocolatier Jacket", "Krawk Blue Bath Robe"
    ],
    r90: [
      "Traditional Shenkuu Hissi Hat", "Shenkuu-Inspired Paper Parasol", "Faerie Queen Wings", "Aisha Space Suit", "Eyrie Militia Coat", "School Girl Shoes", 
      "Snowy Xweetok Collar", "School Girl Plaid Skirt", "Traditional Shenkuu Hissi Gloves", "Usul Red Winter Hat", "Xweetok Popstar Earrings", 
      "Hissi Thief Hood", "Hissi Knight Helmet", "Uni Parade Headdress", "Traditional Shenkuu Hissi Tail Covering", "Carousel Peophin Saddle", 
      "Kougra Flower Lei", "Grundo Space Jacket", "Blumaroo Shepherdess Dress", "Punk Tuskaninny Jacket", "Lutari Band Leader Trousers and Shoes", 
      "Ixi Forest Hood", "Ruki Scientist Jacket", "Basket of Baked Draik Goodies", "Dark Faerie Wings", "Edna Costume Hat", "Aisha Rain Slicker", 
      "Hissi Thief Gloves", "Kougra Buzzer Costume Wings", "Carousel Peophin Collar", "JubJub Scrub Top", "Gelert Spy Trousers", "Lishas Glasses", 
      "Rainbow Chomby Shoes", "Berry Zafara Jacket", "Blumaroo Farmer Overalls", "Uni Parade Harness", "Pink Fluffy Wocky Slippers", 
      "Traditional Shenkuu Hissi Chest Covering", "Hissi Thief Belt", "Sweet Purple Lenny Wig", "Usul Red Winter Jacket", "Xweetok Space Helmet", 
      "Lupe Fishing Shirt", "Ixi Deluxe Gold Collar", "Pink Kacheek Bathing Suit", "Striped Ogrin Sleeping Cap", "Kougra Adventurer Shorts", "Flowery Ixi Wig", 
      "Berry Zafara Goggles", "Kacheek Farm Girl Shirt", "Blue Tonu Tuxedo Cane", "Ranger Eyrie Quiver", "Red Draik Dress", "Acara Festival Gown", 
      "Blonde Acara Wig", "Kougra Adventurer Shirt", "Usul Sailor Jacket", "Ruki Jester Trousers", "Shoyru Flower Hair Clip", "Mutant Tonu Costume", 
      "Ruki Jester Jacket", "Black Hissi Choker", "Usul Beatnik Poetry", "Tweed Gnorbu Jacket", "Futuristic Lutari Diving Shirt", "Lupe Hero Mask", 
      "Kacheek Tourist Shorts", "Berry Zafara Shirt", "Chomby Rainbow Bow", "Lupe Fishing Pole", "Gothic Korbat Skirt", "Draik Space Slacks", "Straw Hat", 
      "Red Hood Chia Shoes", "Red Bead Scorchio Necklace", "Nimmo Adventurer Trousers", "Scorchio Scholar Trousers", "Bori Engineer Cap", 
      "Striped JubJub Beanie", "Black Quiggle Tuxedo Jacket", "Black Quiggle Tuxedo Jacket", "Black Quiggle Tuxedo Jacket", "Black Quiggle Tuxedo Jacket"
    ],
    r85: [
      "Explorer Backpack", "Earth Faerie Wings", "School Girl Shirt", "School Girl Jumper", "Fire Faerie Wings", "Black Derby", "Brown Velvet Bow Hat"
    ],
    r1: []
  },
  {
    name: "Grooming Parlour",
    url: 5,
    blackMarket: [],
    r99: [],
    r95: [
      "Water Faerie Hair Brush", "Air Faerie Hair Brush", "Pea Bubble Bath"
    ],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Magical Bookshop",
    url: 7,
    blackMarket: [],
    r99: [
      "The Voodoo Techo", "Sophie, A Biography", "Illusens Diary", "The Magic Staff", "A History of Chias", "Lenny Cookbook", "Petfolio", "Care of Koi", 
      "Trigonometry Hyperbolics", "A Chia Story", "Kougra Classics", "All About Fire Faeries", "All About Dark Faeries"
    ],
    r95: [
      "Calculus Basics", "Zafara Lore", "Baking Chocolate Korbats", "Iron Skeith", "Jazzmosis Biography", "12 Angry Myncies", "Cenanit Ragamans", 
      "Faerie Secrets", "Chianatomy", "Neopias Past", "Unabridged Dictionary", "Chomby Poems", "The Velveteen Draik", "The Chomby Secret", "Peophin Power!", 
      "The Eyrie Guard", "The Grizzly Gruslen", "The Life of a Hot Dog", "Book of Bruno", "Book of Evil Schemes", "Lupe Digest", "A Magazine", "Mortog Music", 
      "Poogle Day Ideas", "Finding Illusen", "Super Lupe Comics", "Illusens Journey", "Deciphering Your Dreams", "Lupe Legends", "Growing a Vine Yard", 
      "Space and Magic", "Legend Of The Quiggle Runner", "101 Leafy Uses", "Neopian Atlas", "Hold Your Breath", "Famous Chias", "Shenkuu Hiking",
      "Gelert A to Z", "Moehog Masterpieces", "Carnival Of Terror Guide Book", "A Snowbunny Tail"
    ],
    r90: [
      "Faerie Chombies", "The Draik", "Meruth The True Story", "Secret Lenny Book", "Maraquan Pop-Up Book", "Krawk Island Altador Cup Play Book", 
      "Faerieland Altador Cup Media Book", "Shenkuu Altador Cup Media Book", "Decorative Towel Folding", "Mollusk Magazine", "Making Kau Plushies", 
      "Go Home Moehog!", "Do It Yourself Bobbleheads", "Cooking With Your Wock(y)", "Harquins Day", "Usul Investigations", "Draik Tales", 
      "Shenkuu Floral Arrangement", "Little Timmys Story", "Darigan Citadel Altador Cup Media Book", "Purple Lupe Photo Album", "The Lonely JubJub", 
      "Enchanted Butterfly Book", "300m Peanut Dash Guide Book", "An Eyrie Evening", "A Faerie Beautiful Day", "Draik Magic", 
      "Haunted Woods Altador Cup Media Book", "Mystery Island Altador Cup Media Book", "Terror Mountain Altador Cup Media Book", "Forbidden Pteri Tales", 
      "Brightvale Altador Cup Media Book", "The Hot Scorchio Cook Book", "Illusens Book of Charm", "Cooking With Peas", "Common Cures", "Toast Tasting", 
      "Kacheek Magic", "Lost Desert Altador Cup Media Book", "Kiko Lake Altador Cup Media Book", "Zombie Legends", "All About Earth Faeries", 
      "Altador Paperback Book", "Kiko: Emperor of the Desert", "Ixi Glade", "Long Neck Lucy", "The Best of Neopian Ice", "Meridell Altador Cup Media Book", 
      "Altador Cup Rule Book", "Pteri Poetry", "Uni Cycles", "Writers Tips", "My Hobby Book", "Hot Dog Recipes", "Vicious Attack Book", "The Midnight Moehog", 
      "Attack Of The Meercabots", "101 Beverage Recipes", "On Tour with Chomby and the Fungus Balls", "The Dark Peophin", "Feepit Pop-Up Book", "Usul Health",
      "Nimmos Pond Guide Book", "Rare and Retired Items"
    ],
    r85: [
      "Jeran the Lupe", "Cleaning Technology", "Kiko Lake Paperback Book", "A Day At The Races", "The Yurble Spy", "Kiko Christmas Story", "Pteri Bust Out", 
      "Grandfather Koi", "Kiko Boo Boos", "The Flotsam Raiders", "Meerca Day Recipes", "Illusens Ixi", "Practical Jokes", "Trectse fo Thade", "Daffodil Diary", 
      "Kacheek Week", "Nuts, A Love Story"
    ],
    r1: [
      "Algebra", "Train Koi", "Confident Kyrii", "Radio Active Pteri Part 1", "A Tale of Two Lupes", "All About Light Faeries", "JubJub Roll!", 
      "All You Need to Know About Your JubJub", "Oopsy Daisy", "Blumaroo Guide To Dancing", "Purple Power", "Keeping Peophin", "The Happy Blumaroo", 
      "The Great Chomby", "JubJub Manual", "Big Foot the JubJub", "Healing Koi", "Neopian Encyclopedia A - E", "Kaus Guide to Better Grazing", 
      "Neopian Encyclopedia F - J", "Gourmet Cooking For Your Pet", "Neopian Encyclopedia P - T", "Cybunny Financing", "Kiko - Fu", "Raising Young Kau", 
      "Neopian Encyclopedia K - O", "Neopian Encyclopedia U - Z", "Drawing Kiko"
    ]
  },
  {
    name: "Collectable Card Shop",
    url: 8,
    blackMarket: [],
    r99: [
      "Draconus Maximus", "Lord Darigan", "Lord Kass Card", "Khan the Unstoppable", "Captain Xelqued", "Kyrii Sorceror", "Enchanted Ixi", "Siona", "Nocan Vish", 
      "Duel Bazuka", "Sergeant Brexis", "The Tax Beast", "Marillis Harbane", "Professor Kachevski", "Kauvara", "The Incredible Grarrl", "Extreme Herder", 
      "Gilly the Usul", "Punchbag Bob"
    ],
    r95: [
      "Zafara Double Agent", "Branston the Eyrie", "Champion", "Iskha Lightbringer", "Master Vex", "Lady Quintara", "Zeirn the Electric Kougra", 
      "Wock Til You Drop", "Space Krawk", "Jhudora the Dark Faerie", "Neopet Version Two", "Valrigard", "Zygorax", "Krawk Swashbuckler", "Grotson", 
      "Mechanoid Warrior", "The Shop Wizard", "Meruth", "Mr. Chuckles", "Deckswabber", "Gedda Happycheek", "Scauderwelsch", "Illusen the Earth Faerie", 
      "Treasure Seekers", "Margoreth", "Hubrid Nox", "Cherlops, Protector of Garn"
    ],
    r90: [
      "Jahbal", "The Snowager", "Spectre", "Draik Paladin"
    ],
    r85: [
      "Remnok the Nomad"
    ],
    r1: [
      "Shyanna", "The Lava Ghoul", "Sticks and Stones", "Fire Breathing Meerca", "Hagar Mountbane"
    ]
  },
  {
    name: "Battle Magic",
    url: 9,
    blackMarket: [],
    r99: [
      "Bony Grarrl Club", "Water Faerie Token", "Yellow Clockwork Lupe", "Earth Faerie Token", "Dark Faerie Token", "Fire Faerie Token", 
      "Draik Enhancement Brew", "Golden Peophin Harp", "Rainbow Sticky Hand", "Ixi Elixir of the Woods", "Bottled Uni Essence", "Light Faerie Token", 
      "Uni Charm", "Chia Mites", "Icy Chia Goggles", "Apple Jelly Club", "Enchanted Ixi Wand", "Blade of Supernova", "Illusens Gems", "Air Faerie Token", 
      "Mighty Techo Hammer", "Staff of Ultranova", "Grey Sword", "Jam Filled Battle Biscuit", "Blue Clockwork Kiko", "Pink Clockwork Poogle", 
      "Brown Clockwork Grundo", "Red Clockwork Grundo", "Xweetok Battle Batons", "Flying Fireball", "Shoyru Sword", "Green Clockwork Hissi", 
      "Gilded Ruki Flail", "Pteri Egg Shot", "Techo Dagger Of Speed", "Aisha Acorn Darts", "Grarrl Claw", "Bubbling Lupe Potion", "Cybunny Sword", "P-Bomb", 
      "Wooden Krawk Mallet", "Poogle Slingshot", "Pteri Battle Whistle", "Scorchio Battle Wand", "Blade of Ultranova", "Poison Muffin", "Tonu Golden Horn", 
      "Moehog Slingshot", "Enchanted Kougra Pendant", "Chia Apple Bomb", "Quiggle Sword of Terror", "Buzz Hive Bomb", "Jagged Krawk Blade", 
      "Peophin Magical Medallion", "Moehog Crossbow", "Kacheek Extinguisher", "Lightweight Bori Sword", "JubJub Foot Hardening Lotion", "Ixi Hoof Blade", 
      "Wocky Slingshot", "Poogle Liquid Freeze Potion", "Enhanced Acara Potion", "Mini Throwing Toasts", "Tangle Net Gun", "Kougra Power Sword", 
      "Lupe Chia Bomb", "JubJub Flame Ball", "Hydro Hammer", "Lightweight Xweetok Spear", "Blumaroo Pepper Shaker", "Coral Koi Slingshot", "Clockwork Nimmo", 
      "Nova Blade", "Pirate Spear", "Korbat Wing Blade", "Maraquan Aisha Bow", "Bruce Icicle Spear", "Skeith Destructo Horn", "Sack Of Kougranip", 
      "Pearl Koi Slingshot", "Pirate Slingshot", "Toothbrush Sword", "Kougra Wool Bomb", "Wooden Meerca Mallet", "Padded Mynci Gloves", "Grape Jelly Sword", 
      "Maraquan Draik Dagger", "Ruby Krawk Stun Ray", "Sharpened Hook", "Fish Bone Bruce Sword", "Hand Carved Draik Slingshot", "Padded Cybunny Claw", 
      "Mistletoe Potion", "Mango Jelly Club", "Palace Guard Sandals", "Uni Hoof Magnet", "Snotty Sword", "Uni Horn Wand", "Golden Lupe Bone Sword"
    ],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Defence Magic",
    url: 10,
    blackMarket: [],
    r99: [
      "Thyoras Tear", "Squishy Shoyru Healing Stone", "Triple Turbo Dryer", "Flame Reflectozap", "Ultra Dual Shovel", "Ultimate Dark Reflectorb", 
      "Kaylas Magic Cloak", "Lucky Uni Charm", "Bag of Lenny Healing Seeds", "Illusens Silver Shield", "Tower Shield", "Elixir of the Pirate", "Mega U-Bend", 
      "Xweetok Boots Of Speed", "Shoyru Battle Shield", "Lupe Grabber Jaw", "Yurble Blocking Shield", "Hand Carved Shoyru Wand", "Silver Draik Wing Guards", 
      "Eyrie Tail Guard", "Palace Guard Bracers", "Nimmo Elixir of Healing", "Kougra Wing Collar", "Ornate Jetsam Shield", "Brilliant Poogle Buckler", 
      "Aisha Feathered Charm", "Leather Xweetok Helmet", "Poogle Lightning Boots", "Red Yurble Breast Plate", "Bubbling Flotsam Elixir", 
      "Emerald Hissi Breastplate", "Uni Healing Crown", "Meerca Speed Potion", "Kiko Helm of Intellect", "Meerca Tail Shield", "Ornate Buzz Chestplate", 
      "Full Kiko Armour", "Dazzling Steel Lenny Wings", "Blue Nimmo Boots", "Tuskaninny Raiders Helm", "Acara Ear Guards", "Shimmering Acara Breastplate", 
      "Regulation Chainmail", "Wooden Krawk Shield", "Green Techo Bow", "Ultra Supreme Kiko Walker", "Red Yurble Ear Guards", "Full Bruce Armour", 
      "Ornate Jetsam Battle Helmet", "Full Meerca Armour", "Flotsam Chestplate of the Champion", "Silver Draik Chestplate", "Emerald Krawk Jacket", 
      "Emerald Krawk Boots", "Red Yurble Gauntlets", "Green Shoyru Wing Armour", "Healing Ankh of the Nimmo", "Bubbling Ruki Elixir", "Emerald Hissi Shield", 
      "Stealthy Nimmo Boots", "Flotsam Shell Shield"
    ],
    r95: [
      "Purple Scorchstone", "Greater Acara Shield", "Kougra Collar", "Kyrii Golden Apple of Healing", "Green Shoyru Chest Protector", "Gelert Healing Remedy", 
      "Green Scorchstone", "Supple Moehog Sandals"
    ],
    r90: [
      "Kacheek Life Potion"
    ],
    r85: [],
    r1: []
  },
  {
    name: "Neopian Garden Centre",
    url: 12,
    blackMarket: [],
    r99: [
      "Golden Garden Bench", "Chia Statue", "Asparagus Garden", "Star Tree"
    ],
    r95: [
      "Bat Thing Gnome", "Water Rock Garden", "Rainbow Fruit Tree", "Yellow Roundabout", "Dr Sloth Pond", "Rainbow Anthurium", "Exploded Barrel", 
      "Tropical Fern", "Coral Arbor", "Eye of Jhudora Fountain", "Fire Bridge", "Tiered Pond"
    ],
    r90: [
      "Chocolate Bush", "Negg Tree", "Curved Pond", "Snowager Gnome", "Tiki Skate Pond", "Green Poogle Gnome", "Screaming Jack-O-Lantern", "King Skarl Gnome", 
      "Halloween Acara Gnome"
    ],
    r85: [
      "Droopy Maple Bush", "Lucky Slorg Gnome", "Slorg-Shaped Topiary", "Stone Waterfall Pond"
    ],
    r1: []
  },
  {
    name: "Neopian Pharmacy",
    url: 13,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [
      "Sporkle Syrup"
    ],
    r1: []
  },
  {
    name: "Chocolate Factory",
    url: 14,
    blackMarket: [],
    r99: [
      "Deluxe Strawberry Toffee Chokato", "Neotruffle", "Fishy Delight Grarrl Gobstopper", "Rainbow Candy Floss", "Sniddberry Meerca Gobstopper"
    ],
    r95: [
      "Sugar Tonu Skull", "ErgyFruit Jelly Beans", "Chocolate Advent Calendar", "Caramel and Custard Drops", "Holiday Bell Chocolate Advent Calendar", 
      "Snowflake Chocolate Advent Calendar", "Creamy Choccywhip", "Chocolate Cybunny Negg", "Chocolate Peach", "Super Spicy Jelly Beans", 
      "Spooky Flying Doughnut", "Hazelnut Whirl", "Chocolate Dr Sloth", "Yummy Drops", "Cherry Mootix Lollypop", "Angry Candy", "Chocolate Ruki Kit"
    ],
    r90: [
      "Large Swirly Chocolate Cybunny", "Minty Choccywhip", "Chocolate Jeran", "Bullseyes", "Cherry Meerca Gobstopper", "Banana Jelly Flotsam", 
      "Cherry Aboogala Lolly", "Apple and Custard Drops", "Sugar Moehog Skull", "Mint Chocolate Chia", "Mint Chocolate Peophin", 
      "Neverending Jar of Jellybeans", "Kau Sundae"
    ],
    r85: [],
    r1: [
      "Yellow Techo Pop", "Starry Scorchio Chocolate Egg", "Asparagus Chia Treat", "Milk Chocolate Nova", "Grape Blumaroo Gummy Die", 
      "Chocolate Lenny on a Stick"
    ]
  },
  {
    name: "The Bakery",
    url: 15,
    blackMarket: [],
    r99: [
      "Cinnamon Eyrie Cookie", "Blackberry Eyrie Cookie", "Blueberry Deluxe Cake", "Chia Cake", "Chocolate Chip Eyrie Cookie", "Minty Eyrie Cookie"
    ],
    r95: [
      "Scamander Cookies", "Hostile Quiche", "Lime Chomby Cake", "Irate Zafara Claw", "Vionanna Mince Pie", "Kacheek Baby Cabbage Sandwiches", 
      "Kacheek Fruit Salad Sandwich", "Snowy Pancakes", "Sugar Nerkmid Biscuit", "Cranky Croissant", "Fyora Cookies", "Blue PaintBrush Cookie"
    ],
    r90: [
      "Angry Cinnamon Roll", "Choccy Chip Skeith Biscuit", "Kacheek Ombus Fruit Sandwich", "Transparaberry Hot Cross Buns", "Chocolate Chip Nerkmid Biscuit",
      "Illusen Waffle", "Caramel Skeith Surprise", "Strawberry Skeith Biscuit", "Tiered Neopets 8th Birthday Cake", "Banana Split Swiss Roll",
      "Strawberry Shimmer Cake", "Moehog Surprise", "Toast A La King", "Grunion Fruit Krawk Cake", "Hazelnut Banana Crepe", "Custard Doughnut"
    ],
    r85: [],
    r1: [
      "Plain Hissinamon Roll", "Chocolate Kiko Cookie", "Moehog Fruit Cake", "Flotsam Tail Cookies", "Pizza Pasty"
    ]
  },
  {
    name: "Neopian Health Foods",
    url: 16,
    blackMarket: [],
    r99: [
      "Artichoke and Onion Surprise"
    ],
    r95: [
      "Broccoli and Mustard Sandwich", "Fresh Sushi Roll", "Baked Apple with Snowberries", "Cone-Shaped Lemon", "Cone-Shaped Orange", "Cone-Shaped Strawberry", 
      "Broccoli Kebab", "Radish Meringue"
    ],
    r90: [],
    r85: [
      "Golden Ixi Acorn"
    ],
    r1: [
      "Prime Veggie Burger", "Natural Gum", "Turnip", "Chokato Honey Sticks"
    ]
  },
  {
    name: "Neopian Gift Shop",
    url: 17,
    blackMarket: [],
    r99: [
      "Copper Bracelet", "Gold Balloon", "Silverware Set"
    ],
    r95: [
      "Slorg Sea Sculpture"
    ],
    r90: [],
    r85: [
      "Bag of Decorative Glass Marbles", "Lily Pad Placemat", "Striped Sock Mug"
    ],
    r1: [
      "Cheesy Cheesy Placemat", "Yellow Leaf Magnet", "Defaced Portrait of Illusen", "Roo Island Dice Magnet", "Defaced Portrait of Eliv Thade", 
      "Defaced Portrait of Kass", "Red Leaf Magnet", "Defaced Portrait of Gormos", "Brown Leaf Magnet"
    ]
  },
  {
    name: "Smoothie Store",
    url: 18,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: [
      "Small Fishy Smoothie", "Small Bean Smoothie", "Small Shepherds Pie Smoothie", "Small Churro Smoothie"
    ]
  },
  {
    name: "Tropical Food Shop",
    url: 20,
    blackMarket: [],
    r99: [
      "Silver Doughnutfruit", "Pink Chokato", "Vein Cabbage", "Rainbow Doughnutfruit", "Chokato", "Pinanna Plus", "Krakuberries", "ErgyFruit", "Gelupepper", 
      "Juicy Melon"
    ],
    r95: [
      "Purple Juppie Slurpbowl", "Acnefruit", "Pink Peachpa Cooler", "Goparokko Fish Surprise", "Fruity Swirl Souffle"
    ],
    r90: [],
    r85: [
      "Stramberry", "Tangleberry", "Chilled Seaweed Cone", "Ombus Fruit", "Ripe Bomberry"
    ],
    r1: [
      "Mano Root", "Puchini", "Pipper", "Squirming Salad", "Gleenut"
    ]
  },
  {
    name: "Tiki Tack",
    url: 21,
    blackMarket: [],
    r99: [
      "Volcano Crystal"
    ],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Grundos Cafe",
    url: 22,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: ["Deep-Fried Galactic... Food Mass"],
    r85: ["Lime Wiggle Cake"],
    r1: ["Freeze Dried Sprout Soup"]
  },
  {
    name: "Space Weaponry",
    url: 23,
    blackMarket: [],
    r99: [
      "Utility Gloves", "Pocket Satellite", "Dwoobaphone", "Calculation Device", "Bzzapper", "Neutralising Ray"
    ],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Space Armour",
    url: 24,
    blackMarket: [],
    r99: ["Force Shield", "Zero-G Scout Pack"],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "The Neopian Petpet Shop",
    url: 25,
    blackMarket: [],
    r99: ["Babith", "Moltenore"],
    r95: ["Darblat"],
    r90: [],
    r85: ["Zebba"],
    r1: ["Pinklet"]
  },
  {
    name: "The Robo-Petpet Shop",
    url: 26,
    blackMarket: [],
    r99: ["C430 Autobot", "Rollatron", "Rotoblur 4000"],
    r95: ["Fleurbik"],
    r90: ["Avabot"],
    r85: [],
    r1: []
  },
  {
    name: "The Rock Pool",
    url: 27,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "The Rock Pool",
    url: 28,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Spooky Food",
    url: 30,
    blackMarket: [],
    r99: [
      "Cadaverous Cola", "Apple Lantern", "Pink Apple Lantern", "Spoooky Muffin"  
    ],
    r95: [
      "Grundo Toe Lint", "Ghost Puff", "Pink Spooky Ice Cream", "Coffee of the Dead", "Pink Spooky Popcorn", "Chocolate Coated Eye"
    ],
    r90: [],
    r85: ["Brain Ice Cream"],
    r1: []
  },
  {
    name: "Spooky Petpets",
    url: 31,
    blackMarket: [],
    r99: [],
    r95: ["Meepit"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "The Coffee Cave",
    url: 34,
    blackMarket: [],
    r99: ["Murky Green", "Cocoa Juppie Mocha"],
    r95: ["Dark Tea"],
    r90: [],
    r85: [],
    r1: ["Purplum Iced Tea"]
  },
  {
    name: "Slushie Shop",
    url: 35,
    blackMarket: [],
    r99: ["Cherry Lemonade Slushie", "Tar Slushie"],
    r95: ["Secret Sloth Slushie"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Ice Crystal Shop",
    url: 36,
    blackMarket: [],
    r99: ["Stone Snowflake", "Frozen Scroll", "Ice Sceptre"],
    r95: ["Freezing Potion", "Icy Snowflake"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Snow Shop",
    url: 37,
    blackMarket: [],
    r99: [],
    r95: ["Frozen Negg", "Crystal Taco"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Faerieland Bookshop",
    url: 38,
    blackMarket: [],
    r99: [],
    r95: [
      "Hidden Tower Secrets", "Secret Faerie Diary", "The Magic of The Healing Springs", "Faerie Fire"
    ],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Faerie Foods",
    url: 39,
    blackMarket: [],
    r99: ["Space Faerie Mushroom", "Faerie Fruit Salad", "Faerie Chocodrop", "Bacon Belly Buster"],
    r95: [
      "Soup Faerie Mushroom", "Light Faerie Mushroom", "Earth Faerie Mushroom", "Fire Faerie Mushroom", "Dark Faerie Mushroom", 
      "Water Faerie Mushroom", "Air Faerie Mushroom"
    ],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Faerieland Petpets",
    url: 40,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Neopian Furniture",
    url: 41,
    blackMarket: [],
    r99: [
      "Dark Nova Rug", "Tall Pumpkin", "Glowing Bath Tub", "Jolly Pumpkin", "Robo Blumaroo"
    ],
    r95: [
      "Rainbow Disco Ball", "Meridell Emblem Flag", "Flying Robo Sloth", "Judge Hog Bed", "Disco Print Chair", "Orange Kougra Print Sofa", "Robo Aisha", 
      "Autumn Leaf Welcome Mat", "Zafara Double Agent Poster", "Disco Bean Bag Chair", "The Hikalakas Pillow", "Kayla Bean Bag", "Disco Print Stool", 
      "Noble Lord Kass Poster", "Emerald Eyrie Sculpture", "Robo Sloth Fist of Power", "Snow Pant Devil Sculpture", "Blue Velvet Chair", 
      "Red Usuki Display Case", "Iron Sofa", "Jhuidah Cabinet"
    ],
    r90: ["Cloud Play Pen", "Jazzmosis Speaker", "Snorkle Toaster", "Blue Usuki Display Case", "Toadstool Coffee Table"],
    r85: [],
    r1: []
  },
  {
    name: "Tyrannian Foods",
    url: 42,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Tyrannian Furniture",
    url: 43,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Tyrannian Petpets",
    url: 44,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Tyrannian Weaponry",
    url: 45,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: ["Turned Tooth"]
  },
  {
    name: "Hubert's Hot Dogs",
    url: 46,
    blackMarket: [],
    r99: [],
    r95: ["Salt Water Hot Dog", "Strawberry Flavoured Hot Dog", "Honey Coated Hot Dog"],
    r90: [],
    r85: [],
    r1: ["Sand Hot Dog"]
  },
  {
    name: "Pizzaroo",
    url: 47,
    blackMarket: [],
    r99: [],
    r95: ["Whole Steak and Egg Pizza"],
    r90: ["Rainbow Melt Pizza"],
    r85: [],
    r1: []
  },
  {
    name: "Usukiland",
    url: 48,
    blackMarket: [],
    r99: [
      "Graduate Usuki", "Gondolier Usuki", "Little Brother Usuki", "Year 8 Usuki", "Jeran Usuki", "Werewolf Usuki", "Super Hero Usuki", "Valentines Boy Usuki", 
      "Meridell Usuki", "King Skarl Usuki", "Alien Usuki", "Grundo Independence Day Usuki", "Wilderness Usuki Set", "Fire Faerie Usuki Set", "Lord Kass Usuki",
      "Prom Date Usuki Reject", "Summer Fun Usuki", "Negg Faerie Usuki Set", "Meridell Usuki King", "Valentines Girl Usuki", "Ornate Usuki", 
      "Welsh Usuki Reject", "Meridell Usuki Queen", "Usuki Defender", "Pirate Captain Usuki", "Lost Desert Usuki", "Tyrannian Usuki Reject", 
      "Teenage Usuki Reject", "Usuki Buzzer Set", "Usuki Poetry Set", "Official Usuki Battle Set", "Usuki Artist Set", "Usuki Dream Jetski", 
      "Usuki Dream Bike", "Kadoatie Usuki Set", "Usuki Rogue", "Magical Hair Usuki Reject"
    ],
    r95: [
      "Water Faerie Usuki Doll", "Jhudora Usuki Doll", "Air Faerie Usuki Doll", "Usuki Reaper", "Ladybird Usuki", "Dark Faerie Usuki Doll", "Usuki Zombie", 
      "Usuki Knight", "Traditional Welsh Usuki", "Outback Usuki", "Funky Flares Usuki", "Light Faerie Usuki Doll", "Mime Usuki", "Gruundo Fan Usuki", 
      "Fire Faerie Usuki Doll", "Tiki Tack Man Usuki", "Kauvara Usuki", "Mystery Island Usuki", "Usuki Dream Camper", "Tribal Desert Usuki", 
      "Zafara Double Agent Usuki", "Deluxe Sledding Usuki", "Usuki Pirate Wench", "Seaworthy Usuki"
    ],
    r90: ["Usuki Queen Set", "Candy Shop Usuki Set", "Little Sorceress Usuki Doll", "Usuki Scuba Diving Play Set"],
    r85: ["Usuki Cookery Set"],
    r1: []
  },
  {
    name: "Lost Desert Foods",
    url: 49,
    blackMarket: [],
    r99: [],
    r95: ["Pyramid Banana", "Dried Blusops", "Odorra Pod", "Pyramid Pear"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Peopatra's Petpets",
    url: 50,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Sutek's Scrolls",
    url: 51,
    blackMarket: [],
    r99: [
      "Vengeful Scroll", "Book of Flames", "Book of Scarabs", "Golden Scamander Scroll", "Curse of Ultimate Malison", "You Will Get Verrucas!"
    ],
    r95: [
      "Mummified Scroll", "Forgotten Tome", "Scroll of the Warrior", "Scroll of Hunger", "Advanced Curses", "Glowing Book"
    ],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Neopian School Supplies",
    url: 53,
    blackMarket: [],
    r99: ["Rainbow Pencil"],
    r95: [
      "Pea Pod Pencil Case", "Light Faerie Notepad", "Blue Cybunny Backpack", "MSPP Notepad", "Pencil of the Earth Faerie"
    ],
    r90: [
      "Kayla Pencil Case", "Purple Slorg Pencil Holder", "Blue Lab Jelly Folder", "Invisible Ink"
    ],
    r85: [
      "Rainbow Glitter Pens", "Jhudora Pencil Holder", "Starry Jetsam Pencil Sharpener", "Lord Kass Ruler", "Berry Ink Pen", "Snotty School Book"
    ],
    r1: []
  },
  {
    name: "Sakhmet Battle Supplies",
    url: 54,
    blackMarket: [],
    r99: [
      "Super Sand Grain", "Sakhmetian Spear", "Bag of Sand", "Sakhmetian Axe", "Sakhmetian Shield", "Dehydration Potion", "Sakhmetian Dagger", 
      "Golden Coltzan Statue"
    ],
    r95: ["Blackened Pyramid Mace", "Blackened Hand Painted Scimitar"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Osiri's Pottery",
    url: 55,
    blackMarket: [],
    r99: [],
    r95: ["Broken Qasalan Pot", "Ummagine Pot", "Golden Water Lily Bowl"],
    r90: [],
    r85: ["Stone Display Pillar"],
    r1: []
  },
  {
    name: "Merifoods",
    url: 56,
    blackMarket: [],
    r99: ["Roast Pork", "Meridellian Style Mashed Potatoes", "Darigan Draik Egg"],
    r95: [
      "Ice Draik Egg", "Red Draik Egg", "Yellow Draik Egg", "Green Draik Egg", "Blue Draik Egg", "Lost Desert Draik Egg"
    ],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Ye Olde Petpets",
    url: 57,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Neopian Post Office",
    url: 58,
    blackMarket: [],
    r99: [
      "Battle Slices Stamp", "King Kelpbeard Stamp", "King Altador Stamp", "Captain Scarblade Stamp", "Holographic Coltzans Shrine Stamp", "Scuzzy Stamp", 
      "Lord Kass Stamp", "Misprint Meuka Stamp", "Holographic Virtupets Stamp", "Misaligned Printer Stamp", "Inverted Space Faerie Stamp", "The Three Stamp", 
      "Upside Down Island Acara Stamp", "Xantan Stamp"
    ],
    r95: [
      "Dark Battle Duck Stamp", "Quilin Stamp", "Virtupets Space Station Stamp", "Jacques Stamp", "Skeith Defender Stamp", "Garin Stamp", "Isca Stamp", 
      "Hadrak Stamp", "Wise Gnorbu Stamp", "Rainbow Sticky Hand Stamp", "Meerca Spy Stamp", "NeoQuest II Esophagor Stamp", "Sword Of Apocalypse Stamp", 
      "Grundo Warehouse Stamp", "Drackonack Stamp", "The Cyodrakes Gaze Stamp", "Jahbal Stamp", "Shiny Monoceraptor Stamp", "Darigan Moehog Stamp", 
      "Gors The Mighty Stamp", "Von Roos Castle Stamp", "Anshu Fishing Stamp", "Battle Uni Stamp", "Blugthak Stamp", "Guardian Of Spectral Magic Stamp", 
      "Count Von Roo Stamp", "NeoQuest Hero Stamp", "Torakor Stamp", "Morris Stamp", "Anubits Stamp", "Northern Watch Tower Stamp", "Altador Travel Stamp", 
      "The Sleeper Constellation Stamp", "Zafara Double Agent Stamp", "Shadow Gulch Stamp", "Lost City of Phorofor Stamp", "Yellow Knight Stamp"
    ],
    r90: [
      "Lucky Coin Stamp", "Biyako Stamp", "Swordsmaster Talek Stamp", "Mipsy Stamp", "Meridell Heroes Stamp", "Altador Magic Stamp", 
      "Commemorative Defenders Stamp #4", "Darigan Citadel Stamp", "Talinia Stamp", "Gargarox Isafuhlarg Stamp", "Meridell Castle Stamp", 
      "Shumi Telescope Stamp", "Luperus Right Head Stamp", "Zombified Heroes Stamp", "Luperus Centre Head Stamp", "Haunted Mansion Stamp", 
      "Blumaroo Court Jester Stamp", "Orrin Stamp", "Space Faerie Stamp", "Finneus Stamp", "Luperus Left Head Stamp"
    ],
    r85: [],
    r1: ["Mystery Island Aishas Stamp", "Geb Stamp"]
  },
  {
    name: "Haunted Weaponry",
    url: 59,
    blackMarket: [],
    r99: ["Dusty Magic Broom", "Glowing Cauldron", "Scary Spider", "Ethereal Sword", "Pumpkin Club"],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Spooky Furniture",
    url: 60,
    blackMarket: [],
    r99: [],
    r95: ["Spooky Meowclops Candle"],
    r90: ["Candy Vampire Candle"],
    r85: [],
    r1: []
  },
  {
    name: "Wintery Petpets",
    url: 61,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Jelly Foods",
    url: 62,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: ["Jelly Rhubarb", "Black Currant Jelly Pop", "Jelly Green Tea"]
  },
  {
    name: "Kiko Lake Treats",
    url: 66,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: ["Fruit Surprise Rock Slices"],
    r1: ["Pink Rock Slices", "Yellow Rock Slices"]
  },
  {
    name: "Kiko Lake Carpentry",
    url: 67,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Collectable Coins",
    url: 68,
    blackMarket: [],
    r99: [],
    r95: [
      "Rainbow Pool Coin", "Giant Ghostkerchief Coin", "Silver Babaa Coin", "Neopet V2 Coin", "Brass Usuki Coin", "Book Coin", "Goo Blaster Coin", 
      "Snow PaintBrush Coin", "Eliv Thade Coin", "Silver Buzzer Coin", "Super Nova Coin", "Golden Scarab Coin"
    ],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Petpet Supplies",
    url: 69,
    blackMarket: [],
    r99: ["Wobbly Turtum Toy"],
    r95: ["Regal Litter Tray", "Aboogala Petpet Bed"],
    r90: ["Deluxe Blue Tower"],
    r85: ["Green Tiered Scratching Post"],
    r1: []
  },
  {
    name: "Booktastic Books",
    url: 70,
    blackMarket: [],
    r99: ["It Came From Kreludor", "Alien Aisha Invasion", "Guide to the Neocola Machine"],
    r95: ["Kreludan Cookie Cookbook", "The Big Book of Intermediate Evil Plots", "Half Moon Pop-Up Book"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Kreludan Homes",
    url: 71,
    blackMarket: [],
    r99: [],
    r95: ["Orange Hoverbed"],
    r90: ["Curvy Kreludan Table", "Hover Fridge"],
    r85: [],
    r1: []
  },
  {
    name: "Cafe Kreludor",
    url: 72,
    blackMarket: [],
    r99: [],
    r95: ["Kreludan Grunpop", "Kreludan Candy Floss"],
    r90: [],
    r85: ["Toasted Marshmallow Grundo", "Kreludan Cookie Star", "Gooey Kreluberry Pie"],
    r1: []
  },
  {
    name: "Kayla's Potion Shop",
    url: 73,
    blackMarket: [],
    r99: [],
    r95: [
      "Kaylas Super Special Potion", "Elixir of Levelling", "Strength Serum", "Meridellian Potion of Defence", "Twisted Potion of Strength", "Bullseye Potion"
    ],
    r90: ["Energising Elixir"],
    r85: ["Essence of Drackonack"],
    r1: ["Bomberry Elixir", "Bubbling Fungus", "Cooling Balm of the Warrior"]
  },
  {
    name: "Darigan Toys",
    url: 74,
    blackMarket: [],
    r99: ["Darigan Globe"],
    r95: ["Wind Up Lord Darigan"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Faerie Furniture",
    url: 75,
    blackMarket: [],
    r99: [],
    r95: ["Deluxe Fyora Print Rug"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Roo Island Souvenirs",
    url: 76,
    blackMarket: [],
    r99: [],
    r95: ["Fluffy Silver Dice", "Indoor Merry-Go-Round"],
    r90: ["Blumaroo Vanity"],
    r85: [],
    r1: []
  },
  {
    name: "Brightvale Books",
    url: 77,
    blackMarket: [],
    r99: [],
    r95: ["Potions of Brightvale"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Brightvale Books",
    url: 78,
    blackMarket: [],
    r99: ["Greater Healing Scroll"],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Brightvale Glaziers",
    url: 79,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Brightvale Armoury",
    url: 80,
    blackMarket: [],
    r99: ["Crisp Blue Tunic", "Heavy Blue Tunic", "Short Sleeved Yellow Tunic", "Master Wizards Cape"],
    r95: ["Shadowy Cloak of Darkness"],
    r90: ["Regal Black Robe"],
    r85: [],
    r1: []
  },
  {
    name: "Brightvale Fruits",
    url: 81,
    blackMarket: [],
    r99: [],
    r95: ["Assorted Brightvale Fruit Basket", "Flaming Blooble Fruit", "Brightvale Celebratory Fruit Basket"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Brightvale Motery",
    url: 82,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Royal Potionery",
    url: 83,
    blackMarket: [],
    r99: ["Leaded Elemental Vial", "Scroll Potion"],
    r95: ["Greater Earthen Potion"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Neopian Music Shop",
    url: 84,
    blackMarket: [],
    r99: ["Orange Jelly Guitar", "Bronze Gong", "Cutout Violin"],
    r95: [
      "Grand Piano", "Coral Flute", "Bandoneon", "Kyrii Harp", "Faerie Accordion", "Lost Desert Gong", "Christmas Zafara Harp", "Jelly Drum", "Handmade Timpani"
    ],
    r90: [
      "Bagpipes", "Illusens Harp", "Origami Accordion", "Origami Trumpet", "Nimmo Kazoo", "Hand Carved Flute", "Crwth", "Eyrie Wing Harp"
    ],
    r85: ["Peanut Guitar", "Autumn Pumpkin Drum", ],
    r1: []
  },
  {
    name: "Lost Desert Medicine",
    url: 85,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Collectable Sea Shells",
    url: 86,
    blackMarket: [],
    r99: ["Floral Maractite Coin", ],
    r95: [
      "Royal Orange Cowry Shell", "Golden Shell", "Purple Twirly Shell", "Anklet of the Deep", "Streaked Maractite Coin", "Exquisite Peophin Ring of the Deep", 
      "Large Maractite Coin"
    ],
    r90: ["Dazzling Blue Mussel Shell", "Tiny Golden Shell", "Maraquan Draik Maractite Coin"],
    r85: ["Diadem of the Deep"],
    r1: []
  },
  {
    name: "Maractite Marvels",
    url: 87,
    blackMarket: [],
    r99: ["Glowing Maractite Wand", "Maractite Shell Shield", "Maractite Scimitar"],
    r95: [],
    r90: ["Jetsam Maractite Armoured Boots", ],
    r85: [],
    r1: []
  },
  {
    name: "Maraquan Petpets",
    url: 88,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Geraptiku Petpets",
    url: 89,
    blackMarket: [],
    r99: ["Tootum"],
    r95: ["Gypmu"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Qasalan Delights",
    url: 90,
    blackMarket: [],
    r99: [],
    r95: ["Honey Pastry"],
    r90: ["Loaf of Tablet Bread"],
    r85: [],
    r1: ["Queela Quench", "Spicy Queela Dip", "Qando Fruit", "Sand Wich", "Sandy Pita", "Sand Fruit Salad", ]
  },
  {
    name: "Desert Arms",
    url: 91,
    blackMarket: [],
    r99: ["Qasalan Throwing Axe"],
    r95: [],
    r90: [],
    r85: ["Carved Qasalan Blowgun"],
    r1: []
  },
  {
    name: "Words of Antiquity",
    url: 92,
    blackMarket: [],
    r99: [],
    r95: ["Tablet of Jazan", "Scarab Tablet", "Crystal Tablet", "Strangely Etched Tablet", "The Future of Fire"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Faerie Weapon Shop",
    url: 93,
    blackMarket: [],
    r99: ["Bow of the Air Faerie", "Grey Faerie Axe"],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Illustrious Armoury",
    url: 94,
    blackMarket: [],
    r99: ["Altadorian Crest Buckler", ],
    r95: ["Winged Spear", "Altadorian Halberd", "Golden Garfir Helm", "Studded Leather Cuirass", "Altadorian Body Armour"],
    r90: ["Altadorian Swordbreaker"],
    r85: [],
    r1: []
  },
  {
    name: "Exquisite Ambrosia",
    url: 95,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Magical Marvels",
    url: 96,
    blackMarket: [],
    r99: ["Bag of Healing Dust"],
    r95: ["Winged Wand of Wonder", "Amulet of Altador", "Phial of the Dreamer"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Legendary Petpets",
    url: 97,
    blackMarket: [],
    r99: [],
    r95: ["Minitheus"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Plushie Palace",
    url: 98,
    blackMarket: [],
    r99: [
      "Archmagus of Roo Plushie", "Bat Thing Plushie", "Razul Plushie", "Melatite Dervish Plushie", "Frost Lizard Plushie", "Fish Negg Plushie", 
      "Disco Bruce Plushie", "Cloud Draik Plushie", "Magical Yellow Skeith Plushie", "Gloom Kougra Plushie", "Two Rings Archmagus Plushie", 
      "Magical Rainbow Aisha Plushie", "Sidney Plushie", "Lightning Lizard Plushie", "Magical Green Tonu Plushie", "Fire Eyrie Plushie", 
      "Rainbow Tuskaninny Plushie", "Magical Cloud Lenny Plushie", "Halloween Draik Plushie", "NeoQuest Hero Plushie", "King Terask Plushie", 
      "Jahbal Plushie", "Desert Lupe Plushie", "Black Wadjet Plushie", "Magical Red Tonu Plushie", "Serpentine Dervish Plushie", "Magical Purple Koi Plushie", 
      "Magical Green Wocky Plushie", "Magical Red Koi Plushie", "Magical Red Skeith Plushie", "Magical Red Grarrl Plushie", "Blizzard Kougra Plushie", 
      "Blue Doglefox Plushie", "Magical Cloud Gelert Plushie", "Mutant Krawk Plushie", "Mutant Kougra Plushie"
    ],
    r95: [
      "Baby Bruce Plushie", "Shop Wizard Plushie", "Magical Green Cybunny Plushie", "Insane Evil Fuzzle", "Royal Boy Ixi Plushie", 
      "Magical Silver Kougra Plushie", "Faerie Nimmo Plushie", "Faerie Draik Plushie", "Magical Electric Lupe Plushie", "Handcrafted Illusen Plushie", 
      "Disco Nimmo Plushie", "Sophie Plushie", "Starry Koi Plushie", "Yellow Draik Plushie", "Baby Uni Plushie", "Darigan Lupe Plushie", "Purple Mynci Plushie",
      "Armin Plushie", "Grey Wocky Plushie", "Baby Cybunny Plushie", "Electric Evil Fuzzle", "Denethrir Plushie", "Darigan Eyrie Plushie", 
      "Rainbow JubJub Plushie", "Rainbow Fuzzle", "Evil Twin Yellow Chia Plushie", "Electric Fuzzle", "Handcrafted Fyora Plushie", "Angel Chia Plushie",
      "Electric Ixi Plushie", "Baby Peophin Plushie", "Kanrik Plushie", "Desert Grarrl Plushie", "Pink Blumaroo Plushie", "Faerie Lupe Plushie", 
      "Agate Dervish Plushie", "Taelia Plushie", "Baby Techo Plushie", "Desert Ixi Plushie", "Black Bearog Plushie", "Tylix Plushie", "Rainbow Wocky Plushie", 
      "Grey Negg Plushie", "Maraquan Ixi Plushie", "Angry Vira Plushie", "Striped Evil Fuzzle", "Magical Cloud Lupe Plushie", "Illusen Plushie", 
      "The Masked Intruder Plushie", "Un-Valentines Skeith Plushie", "Plains Lupe Neoquest Plushie", "White Skeith Plushie", "Desert Aisha Plushie", 
      "Magical Fire Lupe Plushie", "Desert Elephante Plushie", "Pink Draik Plushie", "Mutant Usul Plushie", "Grey Peophin Plushie", "Ghost Draik Plushie",
      "Darigan Krawk Plushie", "Young Sophie Plushie", "Striped Korbat Plushie", "Scamander Plushie", "Chokato Plushie", "Mutant Kiko Plushie",
      "Halloween Nimmo Plushie", "Grey Lupe Neoquest Plushie", "Mipsy Plushie", "Edna Plushie", "Ghost Ixi Plushie", "Strawberry JubJub Plushie", 
      "Handcrafted Tomos Plushie", "Droolik Plushie", "Starry Fuzzle", "Rainbow Ruki Plushie", "Deviled Steak Plushie", "Jake Plushie",
      "Greedy Kadoatie Plushie", "Rainbow Scorchio Plushie", "Plushie Wocky Plushie", "Rainbow Anubis Plushie", "Darigan Gelert Plushie", 
      "Magical Red Kyrii Plushie", "Rohane Plushie", "Kau Defender of Neopia Plushie", "Magical Yellow Flotsam Plushie", "Red Draik Plushie", "Jhudora Plushie",
      "Mutant Bruce Plushie", "Mutant Techo Plushie", "Halloween Moehog Plushie", "Maraquan Techo Plushie", "Evil Twin Blue Aisha Plushie", "Zombom Plushie",
      "Faerie Slorg Plushie", "Desert Wocky Plushie", "Maraquan Anubis Plushie", "Grey Chomby Plushie"
    ],
    r90: [
      "Zafara Double Agent Plushie", "Asparagus Chia Plushie", "Baby Xweetok Plushie", "Number 5 Plushie", "Number 3 Plushie", "Rainbow Negg Plushie", 
      "Robot Kau Plushie", "Darigan Kau Plushie", "Soup Faerie Plushie", "Number 0 Plushie", "Glyme Plushie", "Cloud Moehog Plushie", 
      "Kacheek Shepherd Plushie", "Number 2 Plushie", "Rainbow Cybunny Plushie", "Orange Skeith Plushie", "Gigantic Balthazar Plushie", "Quiguki Girl Plushie", 
      "Grarrg Action Plushie", "Pirate Techo Plushie", "Faerie Harris Plushie", "Darigan Ixi Plushie"
    ],
    r85: ["Valentines Kadoatie Plushie", "Glowing Draik Plushie", "Number 7 Plushie", "Spardel Plushie"],
    r1: ["Tangella Plushie"]
  },
  {
    name: "Wonderous Weaponry",
    url: 100,
    blackMarket: [],
    r99: [],
    r95: ["Kunai", "Candy Cane Prison Shank"],
    r90: [],
    r85: ["Shuriken"],
    r1: []
  },
  {
    name: "Exotic Foods",
    url: 101,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: ["Bluchard Root", "Asparagus Toast Dumplings", "Korbat Tofu", "Bag of Dried Mushrooms"]
  },
  {
    name: "Remarkable Restoratives",
    url: 102,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: ["Dandelion Root"],
    r1: []
  },
  {
    name: "Fanciful Fauna",
    url: 103,
    blackMarket: [],
    r99: ["Quilin"],
    r95: ["Belonthiss", "Pandaphant"],
    r90: [],
    r85: [],
    r1: ["Robot Blurgah", "Robot Tomamu"]
  },
  {
    name: "Chesterdrawers' Antiques",
    url: 104,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "The Crumpetmonger",
    url: 105,
    blackMarket: [],
    r99: [],
    r95: ["Jetsam Witchdoctor Cake"],
    r90: [],
    r85: [],
    r1: ["Carrot-n-Pea Pie", "Techo Strudel", "Cinnamon and Thyme Quiche"]
  },
  {
    name: "Neovian Printing Press",
    url: 106,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Prigpants & Swolthy, Tailors",
    url: 107,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Mystical Surroundings",
    url: 108,
    blackMarket: [],
    r99: [],
    r95: ["Tyrannian Concert Hall Background"],
    r90: ["Underwater Background", "Tyrannian Volcano Lair Background", "Creepy Cave Background", "Fireworks Background"],
    r85: ["Dreamy Pink Hearts Background", "Broken Stained Glass Window Background"],
    r1: [
      "Polka Dotted Pink Background", "Silver Glitter Background", "Checkered Background", "Pretty Floral Background", "Bubble Paper Background"
    ]
  },
  {
    name: "Lampwyck's Lights Fantastic",
    url: 110,
    blackMarket: [],
    r99: [],
    r95: ["Gear Sofa and Lamp"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Cog's Togs",
    url: 111,
    blackMarket: [],
    r99: [],
    r95: ["Spunky Adventurer Meerca Gloves", "Elegant Punk Guitar"],
    r90: ["Bomber Jacket Shrug", "Leather Bodice"],
    r85: [],
    r1: []
  },
  {
    name: "Molten Morsels",
    url: 112,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: ["Sweet Potato Fizzy Drink"],
    r85: [],
    r1: []
  },
  {
    name: "Moltaran Petpets",
    url: 113,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Moltaran Books",
    url: 114,
    blackMarket: [],
    r99: ["Locating Iron"],
    r95: ["Tangors Autobiography", "Moltara Town Hall Records", "Cog Jewellery Making", "Steam Engineering"],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Springy Things",
    url: 116,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  },
  {
    name: "Ugga Shinies!",
    url: 117,
    blackMarket: [],
    r99: [],
    r95: [],
    r90: [],
    r85: [],
    r1: []
  }
]

//====================================

const URL = document.URL

if (URL.includes("/shops/")) {
  document.title = "Neopets - Shops Directory"
  
  //Get account age
  new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      method: "GET",
      url: "http://www.neopets.com/pirates/foodclub.phtml?type=bet",
      onload: function(response) {
        const htmlElement = document.createElement("html")
        htmlElement.innerHTML = response.responseText

        const accountAge = parseInt(htmlElement.querySelector(".content").textContent.match(/(?<=\()\d+(?= days\))/)[0])
        GM_setValue("accountAge", accountAge)
        let innerHTML = `<div class="directory-wrapper">`

        //Populate directory with a list of links
        for (const each of SHOPS_DIRECTORY) {
          const {name, url, r99, r95, r90, r85, r1} = each
          
          let desiredItems = r1.length
          if (accountAge > 10) desiredItems += r85.length
          if (accountAge > 16) desiredItems += r90.length
          if (accountAge > 31) desiredItems += r95.length
          if (accountAge > 93) desiredItems += r99.length
          console.log(accountAge, desiredItems)
          innerHTML += `
          <div class="directory-item">
            <a class="directory-link" href="http://www.neopets.com/objects.phtml?type=shop&obj_type=${url}">
              <button class="directory-button" ${(desiredItems < 1) ? "disabled" : ""} >
                <span class="button-title">${name}</span>
              </button>
            </a>
          </div>`
        }

        innerHTML += "</div>"
        
        
        
        
        resolve(document.querySelector(".content").innerHTML = innerHTML)
      },
      onerror: function(error) {
        reject(error)
      }
    })
  })  

  GM.addStyle(`
  button {
    cursor: pointer;
  }

  button[disabled=disabled], button:disabled {
    cursor: default;
  }

  .directory-wrapper {
    display: flex;
    flex-wrap: wrap;
  }

  .directory-item {
    margin: 0.5em;
  }

  .directory-button {
    padding: 0.25em 0.5em;
  }
  `)
}

if (URL.includes("obj_type=")) {
  let isFiltered = false
  
  function toggleFilter() {
    isFiltered = !isFiltered
    
    filterToggleButton.textContent = `Turn ${isFiltered ? "off" : "on"} filter`
    
    const shopItems = document.querySelectorAll(".shop-item")
    if (isFiltered) {
      for (const item of shopItems) {
        const name = item.querySelector(".item-name").textContent.trim()
        item.style.display = "none"

        for (const shop of SHOPS_DIRECTORY) {
          if (shop.url == document.URL.match(/(?<=[?&]obj_type=)\d+/)[0]) {
            
            let accountAge = 0
            if (GM_getValue("accountAge")) {
              console.log(GM_getValue("accountAge"))
              accountAge = GM_getValue("accountAge")
            }
            const items = [...shop.r1]
            
            //If account is over 10 days old
            if (accountAge > 10) items.push([...shop.r85])
            
            //If account is over 16 days old
            if (accountAge > 16) items.push([...shop.r90])
            
            //If account is over a month old
            if (accountAge > 31) items.push([...shop.r95])
            
            //If account is over 3 months old
           if (accountAge > 93) items.push([...shop.r99])
            
            //If black market boon is active
            items.push([...shop.blackMarket])

            for (const desired of items) {
              if (name == desired) item.style.display = "block"
            }
          }
        }
      }
    } else {
      for (const item of shopItems) item.style.display = "block"
    }
  }
  
  //Create a button that toggles the filter on and off
  const filterToggleButton = document.createElement("button")
  filterToggleButton.textContent = "Turn on filter"
  filterToggleButton.style.margin = "0 0.5em"
  filterToggleButton.onclick = () => toggleFilter()

  const inventoryTitle = document.querySelector("h2")
  inventoryTitle.appendChild(filterToggleButton)
}