// ==UserScript==
// @name         GC Gourmet Highlighter
// @namespace    https://greasyfork.org/en/users/1175371/
// @version      2.3
// @description  Adds filtering options to view missing avatar gourmets.
// @author       sanjix
// @match        https://www.grundos.cafe/gourmet_club/?pet_name=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477296/GC%20Gourmet%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/477296/GC%20Gourmet%20Highlighter.meta.js
// ==/UserScript==

var showMissingGourmetsButton = document.querySelector('#toggle-missing-books-btn');
showMissingGourmetsButton.click();

var choc = ["Mint Chocolate Kacheek", "Dark Chocolate Poogle", "Orange Chocolate Scorchio", "Juppiemint Bar", "Lemon Sherbert Jelly Beans", "Charcoal Jelly Beans", "Sweet Necklace", "Baby Cabbage Jelly Beans", "Mint Chocolate Lupe", "Dark Chocolate Shoyru", "Mint Chocolate Blumaroo", "Dark Chocolate Skeith", "Strawberry Fondant Surprise", "Fluff N Stuff Grarrl Gobstopper", "Mint Chocolate Chia", "Apple and Custard Drops", "Kau Sundae", "Mint Chocolate Peophin", "Minty Choccywhip", "Bullseyes", "Yummy Drops", "Super Spicy Jelly Beans", "Hazelnut Whirl", "Chocolate Peach", "ErgyFruit Jelly Beans", "Creamy Choccywhip", "Spooky Flying Doughnut", "Omnipotent Onion Grarrl Gobstopper", "Caramel and Custard Drops", "Neotruffle", "Deluxe Strawberry Toffee Chokato", "Fishy Delight Grarrl Gobstopper", "Double Chocolate Jelly Beans", "Lemon and Lime Easter Negg", "Luxury Chocolate Easter Negg", "Mint Chocolate Easter Negg", "Chocolate Orange Easter Negg", "Pretty Pink Easter Negg", "Spotted Easter Negg", "Strawberries and Cream Easter Negg", "Chococherry Blumaroo Ears", "Chocolate Gum", "Chocoon", "Crunchy Chocolate Grarrl", "Chocolate Lipstick", "Chocolate Peanuts With Peas", "Choco Spray", "Lemon and Lime Springtime Negg", "Luxury Chocolate Springtime Negg", "Mint Chocolate Springtime Negg", "Chocolate Orange Springtime Negg", "Pretty Pink Springtime Negg", "Spotted Springtime Negg", "Strawberries and Cream Springtime Negg", "Strawberry Swirl Springtime Negg", "Lemon Sherbert Springtime Negg", "Chrysaberry Surprise Springtime Negg", "Sardplant Springtime Negg", "Phear Springtime Negg", "Peachpa Springtime Negg", "Lovely Lime Springtime Negg", "Dancing Daisy Springtime Negg", "Fruity Faerie Springtime Negg", "Combomelon Springtime Negg", "Cornupepper Springtime Negg", "Neotruffle", "Rainbow Candy Floss", "Banana Jelly Flotsam", "Choco Spritz", "White Chocolate Nova", "Raspberry and Vanilla Nova", "Buzz Chocolate Bar", "Red Buzz Lolly", "Chocolate Dr Sloth", "White Chocolate Lutari", "Dark Chocolate Lutari", "Peophin Chocolate Medallion"];
var health = ["Cube-Shaped Strawberry", "Parsnip Pie", "Jelly Covered Greycorn", "Stuffed Olive Salad", "Cube-Shaped Orange", "Cube-Shaped Lemon", "Cone-Shaped Watermelon", "Cube-Shaped Cherry", "Radish Pie", "Cabbage Cupcake", "Cone-Shaped Strawberry", "Radish Meringue", "Cheesy Broccoli Bite", "Baked Apple with Snowberries", "Cone-Shaped Orange", "Broccoli Kebab", "Fresh Sushi Roll", "Cone-Shaped Lemon", "Radish and Cheese", "Broccoli and Mustard Sandwich", "Fresh Sushi Cone", "Cauliflower Lolly", "Pickled Cauliflower", "Cauliflower Shake", "Cauliflower Soup", "Cone-Shaped Cherry", "Asparagus Balls", "Cheesy Asparagus", "Asparagus Pie", "Luxury Cabbage Cake", "Four Layer Carrot Cake", "Cheesy Carrots", "Broccoli with Sprinkles", "Tomato Kebab", "French Onion Soup", "Artichoke Fondue", "Artichoke Cupcake", "Artichoke and Onion Surprise","Cube-Shaped Pumpkin", "Cone-Shaped Pumpkin", "Golden Carrot", "Cone-Shaped Cherry", "Cone-Shaped Lemon", "Cone-Shaped Orange", "Cone-Shaped Strawberry", "Cone-Shaped Watermelon", "Cube-Shaped Cherry", "Cube-Shaped Lemon", "Cube-Shaped Orange", "Cube-Shaped Strawberry"];
var spook = ["Ghost Marshmallows", "Haunted Milk", "Intestines and Marinara", "Rest in Peace of Chicken", "Blumaroo Tail Salad Extravaganza", "Spooky Handwich", "The Stuff", "Spooky Jelly Brains", "Hair Stuffed Maggot", "Bat Kebab", "Chocolate Coated Eye", "Grundo Toe Lint", "Mouldy Cheese", "Parts on a Pizza", "Meerca Pie", "Quiggle Pie", "Runny Snot", "Crunchy Snotball", "Wing of Korbat", "Snorkle Pudding", "Pumpkin Scoopings", "Jelly Spider Eyeball", "Apple Lantern", "Halloween Candy Cane", "Coco Pumpkin", "Gorerito", "Jelly Finger", "Spoooky Muffin", "Fright Pop", "Spooky Ghostbeef", "Gnome Shroom", "Crypt of Spaghetti", "Brainburger", "Knuckle Sandwich", "Brainburger", "Crypt of Spaghetti", "Knuckle Sandwich", "Edgy Soup", "Meowing Pumpkin", "Pumpkin King", "Toothy Pumpkin", "Witchy Pumpkin", "Korbat Wing Soup", "Brains a la Tree"];
var snow = ["Fruity Brucicle", "Moehog Lollypop", "Chocolate Kyrii Ice Cream", "Strawberry Chia Pop", "Grape Jelly Brucicle", "Crystal Burger", "Crystal Cookies", "Crystal Crunch", "Frozen Negg", "Crystal Pop", "Crystal Taco", "Crystal Turkey", "Banana Split Chia Pop", "Angelic Ice Lolly", "Hamarama Ice Lolly", "Magical Apple Chia Pop", "Magical Asparagus Chia Pop", "Magical Aubergine Chia Pop", "Magical Avocado Chia Pop", "Magical Blueberry Chia Pop", "Magical Carrot Chia Pop", "Magical Chokato Chia Pop", "Magical Durian Chia Pop", "Magical Gooseberry Chia Pop", "Magical Grape Chia Pop", "Magical Lemon Chia Pop", "Magical Lime Chia Pop", "Magical Orange Chia Pop", "Magical Pea Chia Pop", "Magical Peach Chia Pop", "Magical Pear Chia Pop", "Magical Pepper Chia Pop", "Magical Pineapple Chia Pop", "Magical Plum Chia Pop", "Magical Thornberry Chia Pop", "Magical Tomato Chia Pop", "Tartan Chia Pop", "Magical Nugget Chia Pop", "Snowager Ice Lolly", "Magical Strawberry Brucicle", "Sparkly Ice Lolly", "Fruity Brucicle", "Grape Jelly Brucicle", "Moehog Lollypop", "Chocolate Kyrii Ice Cream", "Mint Kyrii Ice Cream", "Magical Dragonfruit Chia Pop", "Magical Corn Chia Pop", "Magical Cherry Chia Pop","Ice Cream Sundae", "Rainbow Sherbert Ice Cream", "Mint and Chocolate Ice Cream", "Five Scoop Ice Cream", "Double Chocolate Ice Cream", "Blueberry Krawksicle", "Frozen Cybunny Treat", "Magical Snowberry Chia Pop", "Snow Soup", "Snowball Soup", "Snow Snowball Soup", "Snow Snowball Snow Soup"];
var other = ["Grey Faerie Mushroom", "Light Faerie Mushroom"]
var smoothies = ["Mega Blueberry Tomato Smoothie", "Mega Wild Chocomato Smoothie", "Mega Ice Creamy Jelly Smoothie", "Mega Original Kiwi Smoothie", "Mega Super Lemon Grape Smoothie", "Mega Lemon Blitz Smoothie", "Mega Rasmelon Smoothie", "Mega Salmon Sherbert Smoothie", "Mega Islandberry Smoothie", "Mega Roasted Chestnut Smoothie", "Mega Orange Clove Smoothie", "Frozen Faerie Ixi Coconut Smoothie", "Large Melon Berry Spinach Leek Smoothie", "Berry Melon Spinach Leek Smoothie", "Grapeberry Krawkade"]
var avatarGourmets = [];
avatarGourmets.push(choc);
avatarGourmets.push(health);
avatarGourmets.push(spook);
avatarGourmets.push(snow);
avatarGourmets.push(other);
avatarGourmets.push(smoothies);

var sortingButtonsGroup = document.createElement('div');
sortingButtonsGroup.className = 'sortingButtonsGroup';
sortingButtonsGroup.style.textAlign = 'center';

var button = document.createElement('button');
button.className = "highlighter";
button.textContent="Show only avatar gourmets";

button.addEventListener("click", function() {toggleAvatarGourmets();});
var gourmetsEaten = document.querySelector('main form');
var bottomButtonGroup = document.querySelectorAll('main .button-group')[1];
bottomButtonGroup.after(sortingButtonsGroup);

var chocbutton = document.createElement('button');
chocbutton.className = 'highlighter candy';
chocbutton.textContent = 'Hide candy gourmets';
var healthbutton = document.createElement('button');
healthbutton.className = 'highlighter health';
healthbutton.textContent = 'Hide health gourmets';
var spookbutton = document.createElement('button');
spookbutton.className = 'highlighter spooky';
spookbutton.textContent = 'Hide spooky gourmets'
var snowbutton = document.createElement('button');
snowbutton.className = 'highlighter snow';
snowbutton.textContent = 'Hide snow gourmets';
var otherbutton = document.createElement('button');
otherbutton.className = "highlighter other";
otherbutton.textContent = "Hide other gourmets";
var smoothiesbutton = document.createElement('button');
smoothiesbutton.className = 'highlighter smoothies';
smoothiesbutton.textContent = 'Hide smoothie gourmets';
sortingButtonsGroup.appendChild(button);
sortingButtonsGroup.appendChild(chocbutton);
sortingButtonsGroup.appendChild(healthbutton);
sortingButtonsGroup.appendChild(spookbutton);
sortingButtonsGroup.appendChild(snowbutton);
sortingButtonsGroup.appendChild(otherbutton);
sortingButtonsGroup.appendChild(smoothiesbutton);

chocbutton.addEventListener('click', function() {showHideGourmets(choc);});
healthbutton.addEventListener('click', function() {showHideGourmets(health);});
spookbutton.addEventListener('click', function() {showHideGourmets(spook);});
snowbutton.addEventListener('click', function() {showHideGourmets(snow);});
otherbutton.addEventListener('click', function() {showHideGourmets(other);});
smoothiesbutton.addEventListener('click', function() {showHideGourmets(smoothies);});

var items = document.querySelectorAll('#missing-books-grid.gourmet-grid .gourmet-item');
items.forEach((item) => {
    item.style.display = 'inline-block';
})


function showHideGourmets(avType) {
    var items = document.querySelectorAll('#missing-books-grid.gourmet-grid .gourmet-item');
    items.forEach((item) => {
        // console.log(item.children[0].children[0].children[0].alt);
        if (avType.includes(item.children[0].children[0].children[0].alt)) {
            if (item.style.display == '' || item.style.display == 'inline-block') {
                item.style.display = 'none';
                if (avType == choc) {
                     chocbutton.textContent='Show candy gourmets';
                } else if (avType == health) {
                    healthbutton.textContent='Show health gourmets';
                } else if (avType == spook) {
                    spookbutton.textContent='Show spooky gourmets';
                } else if (avType == snow) {
                    snowbutton.textContent='Show snow gourmets';
                } else if (avType == other) {
                    otherbutton.textContent='Show other gourmets';
                } else if (avType == smoothies) {
                    smoothiesbutton.textContent='Show smoothie gourmets';
                }
            } else if (item.style.display == 'none') {
                item.style.display = 'inline-block';
                if (avType == choc) {
                     chocbutton.textContent='Hide candy gourmets';
                } else if (avType == health) {
                    healthbutton.textContent='Hide health gourmets';
                } else if (avType == spook) {
                    spookbutton.textContent='Hide spooky gourmets';
                } else if (avType == snow) {
                    snowbutton.textContent='Hide snow gourmets';
                } else if (avType == other) {
                    otherbutton.textContent='Hide other gourmets';
                } else if (avType == smoothies) {
                    smoothiesbutton.textContent='Hide smoothie gourmets';
                }
            }
        }
    });
}

function toggleAvatarGourmets() {
    var items = document.querySelectorAll('#missing-books-grid.gourmet-grid .gourmet-item');
    items.forEach((item) => {
        //if (avatarGourmets.flat().includes(item.textContent.replace(/\ufeff/g,"").trim())) {
        //    item.style.backgroundColor = 'yellow';
        //}});
        itemName = item.children[0].children[0].children[0].alt;
        // console.log(choc.includes(itemName));
        // console.log(itemName);
        if (choc.includes(itemName)) {
            item.style.border = '5px solid #C6A680';
        } else if (health.includes(itemName)) {
            item.style.border = '5px solid #C9E5CD';
        } else if (spook.includes(itemName)) {
            item.style.border = '5px solid #FFCD7E';
        } else if (snow.includes(itemName)) {
            item.style.border = '5px solid #DDFFFF';
        } else if (other.includes(itemName)) {
            item.style.border = '5px solid #E7BAFF';
        } else if (smoothies.includes(itemName)) {
            item.style.border = '5px solid #ff0099'; 
        } else if (item.style.display == '' || item.style.display == 'inline-block') {
            item.style.display = 'none';
            button.textContent = "Show all gourmets";
        } else {
            item.style.display = 'inline-block';
            button.textContent = "Show only avatar gourmets";
        }});
}

var eaten = document.querySelectorAll('#sortable-gourmet-table img');
var progress = document.createElement('table');


var header = progress.createTHead().insertRow();
header.appendChild(document.createElement('th')).textContent = 'Chocolate';
header.appendChild(document.createElement('th')).textContent = 'Healthy';
header.appendChild(document.createElement('th')).textContent = 'Spooky';
header.appendChild(document.createElement('th')).textContent = 'Snow';
header.appendChild(document.createElement('th')).textContent = 'Other';
header.appendChild(document.createElement('th')).textContent = 'Smoothies';
var body = progress.createTBody().insertRow();

var chocprog = 0;
var healthprog = 0;
var spookprog = 0;
var snowprog = 0;
var otherprog = 0;
var smoothieprog = 0;

eaten.forEach((food) => {
    if (choc.includes(food.alt)) {
        chocprog += 1;
    } else if (health.includes(food.alt)) {
        healthprog += 1;
    } else if (spook.includes(food.alt)) {
        spookprog += 1;
    } else if (snow.includes(food.alt)) {
        snowprog += 1;
    } else if (other.includes(food.alt)) {
        otherprog += 1;
    } else if (smoothies.includes(food.alt)) {
        smoothieprog += 1;
    }
});
if (chocprog == choc.length) {
    chocbutton.style.display = 'none';
} else if (healthprog == health.length) {
    healthbutton.style.display = 'none';
} else if (spookprog == spook.length) {
    spookbutton.style.display = 'none';
} else if (snowprog == snow.length) {
    snowbutton.style.display = 'none';
} else if (otherprog == other.length) {
    otherbutton.style.display = 'none';
} else if (smoothieprog == smoothies.length) {
    smoothiesbutton.style.display = 'none';
}
body.insertCell().textContent = chocprog;
body.insertCell().textContent = healthprog;
body.insertCell().textContent = spookprog;
body.insertCell().textContent = snowprog;
body.insertCell().textContent = otherprog;
body.insertCell().textContent = smoothieprog;

progressBottom = progress.cloneNode(true);
gourmetsEaten.before(progress);
bottomButtonGroup.after(progressBottom);

progress.style.border = 'black 1px solid';
progress.style.marginLeft = 'auto';
progress.style.marginRight = 'auto';
progress.style.marginBottom = '1em';
progress.style.borderCollapse = 'collapse';
progressBottom.style.border = 'black 1px solid';
progressBottom.style.marginLeft = 'auto';
progressBottom.style.marginRight = 'auto';
progressBottom.style.marginBottom = '1em';
progressBottom.style.borderCollapse = 'collapse';
document.querySelectorAll('th').forEach((item) => {item.style.border = 'black 1px solid'; item.style.padding = '0 1em';});
document.querySelectorAll('td').forEach((item) => {item.style.border = 'black 1px solid'; item.style.padding = '0 1em';});