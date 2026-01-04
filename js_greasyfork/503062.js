// ==UserScript==
// @name         Neopets Golden Dubloon Flash-Free
// @version      1.0.21
// @description  Removes Flash element and inserts restaurant menu tables with improved formatting
// @match        https://www.neopets.com/pirates/restaurant.phtml?type=1
// @match        https://www.neopets.com/pirates/restaurant.phtml?type=2
// @match        https://www.neopets.com/pirates/restaurant.phtml?type=3
// @match        https://www.neopets.com/pirates/restaurant.phtml?type=4
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @author       Posterboy
// @namespace    https://greasyfork.org/users/1277376
// @downloadURL https://update.greasyfork.org/scripts/503062/Neopets%20Golden%20Dubloon%20Flash-Free.user.js
// @updateURL https://update.greasyfork.org/scripts/503062/Neopets%20Golden%20Dubloon%20Flash-Free.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        // Select the Flash element
        var flashElement = document.querySelector('ruffle-embed[type="application/x-shockwave-flash"]');

        if (flashElement) {
            // Remove the Flash element
            flashElement.parentNode.removeChild(flashElement);
        }

        // Create the new content for the restaurant menu with CSS styling
        var newContent = `
            <style>
                /* Style for the tables */
                .custom-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px auto;
                    font-size: 16px;
                    border: 1px solid #BF8D45; /* Border color */
                    background-color: #F5F5F5; /* Background color */
                }
                .custom-table th, .custom-table td {
                    border: 1px solid #BF8D45;
                    padding: 10px;
                    text-align: left;
                }
                .custom-table th {
                    background-color: #BF8D45; /* Header background color */
                    color: white;
                }
                .custom-table tr:nth-child(even) {
                    background-color: #FAEBD7; /* Light background for alternating rows */
                }
                .custom-table tr:hover {
                    background-color: #F0E68C; /* Hover effect background color */
                }
                .custom-table td {
                    position: relative;
                }
                .custom-table td a {
                    display: block;
                    width: 100%;
                    height: 100%;
                    text-decoration: none;
                    color: #000;
                    padding: 10px;
                    box-sizing: border-box;
                }
                .custom-table td a:hover {
                    background-color: #F0E68C; /* Hover effect color for the clickable area */
                }
                .custom-table img {
                    width: 80px;
                    height: auto;
                }
            </style>

            <!-- Appetisers Table -->
            <table class="custom-table">
                <tr>
                    <th>Starters</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td><img src="//images.neopets.com/items/piratefood_7.gif" alt="Caesar Salad"></td>
                    <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15707">Caesar Salad - Fresh lettuce, caesar dressing and croutons. <b>1 Dubloon</b></a></td>
                </tr>
                <tr>
                    <td><img src="//images.neopets.com/items/piratefood_3.gif" alt="Tropical Breeze"></td>
                    <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15703">Tropical Breeze - A generous helping of Chokato and Tigersquash ice cream. <b>1 Dubloon</b></a></td>
                </tr>
                <tr>
                    <td><img src="//images.neopets.com/items/piratefood_4.gif" alt="Oyster Obsession"></td>
                    <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15704">Oyster Obsession - A fishy treat that's full of surprises. <b>2 Dubloon</b></a></td>
                </tr>
                <tr>
                    <td><img src="//images.neopets.com/items/piratefood_5.gif" alt="Tomato Cannon Ball"></td>
                    <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15705">Tomato Cannon Ball - To get the unique texture and flavour a large tomato is cooked by being fired out of a cannon. <b>2 Dubloon</b></a></td>
                </tr>
                <tr>
                    <td><img src="//images.neopets.com/items/piratefood_2.gif" alt="Crusty Clam Surprise"></td>
                    <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15702">Crusty Clam Surprise - Mashed clams with a marshmallow pearl and a rather surprising sauce. <b>3 Dubloon</b></a></td>
                </tr>
                <tr>
                    <td><img src="//images.neopets.com/items/piratefood_6.gif" alt="Shiver Me Shrimp"></td>
                    <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15706">Shiver Me Shrimp - Three plump shrimp served with cocktail sauce. <b>3 Dubloon</b></a></td>
                </tr>
                <tr>
                    <td><img src="//images.neopets.com/items/piratefood_1.gif" alt="Double Stuffed Guppy"></td>
                    <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15701">Double Stuffed Guppy - A large guppy that has another fish inside it... how on earth do they do that?. <b>5 Dubloon</b></a></td>
                </tr>
            </table>

            <!-- Main Courses Table -->
            <table class="custom-table">
                <tr>
                    <th>Main Course</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td><img src="//images.neopets.com/items/piratefood_37.gif" alt="Cap'n Threelegs Cutlass Crusade"></td>
                    <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15737">Cap'n Threelegs Cutlass Crusade - A large juicy steak, cooked extra rare and served with a jacket potato and asparagus. <b>9 Dubloon</b></a></td>
                </tr>
                <tr>
                    <td><img src="//images.neopets.com/items/piratefood_32.gif" alt="Headless Horsefish"></td>
                    <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15732">Headless Horsefish - An unusual fish found off the coast of Smugglers Cove, it has a tangy, almost spicy flavour. <b>5 Dubloon</b></a></td>
                </tr>
                <tr>
                    <td><img src="//images.neopets.com/items/piratefood_38.gif" alt="Our Famous Krawk Pie"></td>
                    <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15738">Our Famous Krawk Pie - Our house speciality made from fresh vegetables found on Krawk Island. What you didn't really think we would cook Krawks did you? <b>5 Dubloon</b></a></td>
                </tr>
                <tr>
                    <td><img src="//images.neopets.com/items/piratefood_35.gif" alt="Bilge Rat Madeira"></td>
                    <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15735">Bilge Rat Madeira - A plump bilge rat, lightly grilled and then smothered with delicious madeira sauce. <b>4 Dubloon</b></a></td>
                </tr>
                <tr>
                    <td><img src="//images.neopets.com/items/piratefood_33.gif" alt="Slithering Squid Surprise"></td>
                    <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15733">Slithering Squid Surprise - The dish that wriggles as you eat. <b>3 Dubloon</b></a></td>
                </tr>
                <tr>
                    <td><img src="//images.neopets.com/items/piratefood_31.gif" alt="Baby Bloater"></td>
                    <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15731">Baby Bloater - A small fish served with fresh salad and a creamy sauce. <b>7 Dubloon</b></a></td>
                </tr>
                <tr>
                    <td><img src="//images.neopets.com/items/piratefood_36.gif" alt="Big Roasted Fish"></td>
                    <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15736">Big Roasted Fish - Large fish roasted with garlic and herbs, served with a side of roasted vegetables. <b>8 Dubloon</b></a></td>
                </tr>
            </table>

<!-- Desserts Table -->
<table class="custom-table">
    <tr>
        <th>Desserts</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_23.gif" alt="Swashbuckling Sundae"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15723">Swashbuckling Sundae - A delightful sundae with a pirate twist! <b>3 Dubloon</b></a></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_24.gif" alt="Pirate's Plunder Pie"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15724">Pirate's Plunder Pie - A rich and savory pie filled with sweet surprises. <b>4 Dubloon</b></a></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_25.gif" alt="Buccaneer Brownie"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15725">Buccaneer Brownie - A decadent brownie perfect for any pirate's sweet tooth. <b>3 Dubloon</b></a></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_26.gif" alt="Sea Captain's Cake"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15726">Sea Captain's Cake - A cake as grand as any sea captain's treasure! <b>5 Dubloon</b></a></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_27.gif" alt="Coral Cupcake"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15727">Coral Cupcake - A vibrant cupcake with a coral-inspired decoration. <b>2 Dubloon</b></a></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_28.gif" alt="Tropical Trifle"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15728">Tropical Trifle - Layers of tropical fruit and cream in a delicious trifle. <b>4 Dubloon</b></a></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_29.gif" alt="Island Ice Cream"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15729">Island Ice Cream - A refreshing ice cream with island flavors. <b>3 Dubloon</b></a></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_30.gif" alt="Treasure Chest Cookies"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15730">Treasure Chest Cookies - Crunchy cookies that look like treasure chests. <b>2 Dubloon</b></a></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_31.gif" alt="Sailor's Sundae"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15731">Sailor's Sundae - A sundae fit for a sailor after a long voyage. <b>3 Dubloon</b></a></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_32.gif" alt="Scallywag Sorbet"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15732">Scallywag Sorbet - A tangy sorbet to cool off your scallywag spirit. <b>3 Dubloon</b></a></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_33.gif" alt="Captain's Cupcake"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15733">Captain's Cupcake - A cupcake worthy of the captain's table. <b>2 Dubloon</b></a></td>
    </tr>
</table>

<!-- Cocktails Table -->
<table class="custom-table">
    <tr>
        <th>Cocktails</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_9.gif" alt="Bomberry Grog"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15709">Bomberry Grog</a> - Aye.. Finest grog with bomberry juice. <b>2 Dubloon</b></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_10.gif" alt="ErgyFruit Grog"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15710">ErgyFruit Grog</a> - Your average bog standard grog flavoured with ErgyFruit juice. <b>2 Dubloon</b></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_11.gif" alt="Tchea Grog"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15711">Tchea Grog</a> - A fruity, full flavoured grog for the connoisseur. <b>2 Dubloon</b></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_12.gif" alt="Krakuberry Grog"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15712">Krakuberry Grog</a> - This grog will soon put hairs on ye chest! <b>2 Dubloon</b></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_14.gif" alt="Cherry Pop"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15714">Cherry Pop</a> - A refreshing sparkling drink infused with fresh cherries. <b>2 Dubloon</b></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_15.gif" alt="Purple Pop"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15715">Purple Pop</a> - Despite the rather *interesting* colour, this fruity sparkling drink tastes delicious. <b>2 Dubloon</b></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_16.gif" alt="Raspberry Pop"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15716">Raspberry Pop</a> - How strange, it tastes of raspberry, yet it is blue! <b>2 Dubloon</b></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_19.gif" alt="Cannon Fodder"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15719">Cannon Fodder</a> - This sparkling cocktail is quite explosive! <b>2 Dubloon</b></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_8.gif" alt="Grog Light"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15708">Grog Light</a> - Grog for the calorie conscious sea dog. <b>2 Dubloon</b></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_18.gif" alt="Keel Haul"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15718">Keel Haul</a> - This extra strong cocktail is made from lime juice, bomberries and our secret ingredient. <b>2 Dubloon</b></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_21.gif" alt="Land Lubber"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15721">Land Lubber</a> - A fruity, yet potent cocktail that will soon have you singing sea shanties. <b>2 Dubloon</b></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_13.gif" alt="Lemon Pop"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15713">Lemon Pop</a> - Perfect for quenching any young pirate's thirst. <b>2 Dubloon</b></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_17.gif" alt="Man O War"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15717">Man O War</a> - A colourful cocktail that tastes as good as it looks. <b>2 Dubloon</b></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_20.gif" alt="Walk The Plank"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15720">Walk The Plank</a> - A ferocious beverage served in a stylish glass. <b>2 Dubloon</b></td>
    </tr>
    <tr>
        <td><img src="//images.neopets.com/items/piratefood_22.gif" alt="Hogshead"></td>
        <td><a href="//www.neopets.com/pirates/process_restaurant.phtml?type=add&amp;item=15722">Hogshead</a> - An entire hogshead of grog. Only for the stoutest of sea dogs. <b>10 Dubloon</b></td>
    </tr>
</table>
        `;

        // Find the <br clear="all"> element
        var brElement = document.querySelector('br[clear="all"]');

        if (brElement) {
            // Insert the new content before the <br> element
            brElement.insertAdjacentHTML('beforebegin', newContent);
        }
    });
})();