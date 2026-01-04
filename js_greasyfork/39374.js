// ==UserScript==
// @name         Neopets shop price with gold jump
// @namespace    http://tampermonkey.net/
// @version      0.87
// @description  display price info at neopets.com
// @author       lichdkimba
// @match        http://www.neopets.com/objects.phtml?type=shop&obj_type=*
// @match        http://www.neopets.com/market.phtml*
// @match        http://www.neopets.com/inventory.phtml
// @match        http://www.neopets.com/safetydeposit.phtml*
// @match        http://www.neopets.com/winter/igloo2.phtml
// @match        http://www.neopets.com/objects.phtml?obj_type=*
// @match        http://www.neopets.com/closet.phtml*
// @match        http://www.neopets.com/auctions*
// @match        http://www.neopets.com/island/tradingpost*
// @match        http://www.neopets.com/useobject.phtml
// @grant        GM_setValue
// @grant        GM_getValue
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/39374/Neopets%20shop%20price%20with%20gold%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/39374/Neopets%20shop%20price%20with%20gold%20jump.meta.js
// ==/UserScript==



var items = []
var shop_user_item = {}
var auc_user_item = {}
try {

	var mydata = GM_getValue("shop_json")
	if(mydata != undefined) {
		shop_user_item = JSON.parse(mydata)
	}

	mydata = GM_getValue("auc_json")
	if(mydata != undefined) {
		auc_user_item = JSON.parse(mydata)
	}

} catch(e) {
	GM_setValue("shop_json", "")
	GM_setValue("auc_json", "")
}
//拍卖自动定价
var c_url = window.location.href;
if(c_url == "http://www.neopets.com/useobject.phtml" || c_url == "https://www.neopets.com/useobject.phtml") {

if ($("body > p").innerHTML="<b>NOTE</b>: If you check the Neofriends Only box, only your Neofriends will be allowed to bid on the auction!") {
	var text=$('body > center > b')[0].innerHTML
	text=text.replace("Putting ","")
	text=text.replace(" up for Auction","")

	if (auc_user_item[text]!=undefined) {
		price_1=auc_user_item[text]["start_price"]
		price_2=auc_user_item[text]["ins_price"]
		console.log(price_1,price_2)
		console.log($("input"))
		$("input")[0].value=price_1
		$("input")[1].value=price_2
	}






}






}


var links = []
var differs = []
function get() {
	tds = $("td[width='120']")
	items = []

	if(tds.length > 0) {

		for(var i = 0; i < tds.length; i++) {
			var onclickstring = $("#content > table > tbody > tr > td.content > form:nth-child(8) > div > table > tbody > tr > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > a:eq(" + i + ")").attr("onclick")

			onclickstring = onclickstring.replace(" you sure you wish to purchase Green Velvet Dress Coat at 1,100 NP?\n\n(you can still haggle to push the price lower!)')) { return false; }", "")
			onclickstring = onclickstring.replace("'+'", "")
			onclickstring = onclickstring.replace("this.href='", '')
			onclickstring = onclickstring.split("';if (!confirm('Are")[0]
			links.push("http://www.neopets.com/" + onclickstring)
		}

		for(var i = 0; i < tds.length; i++) {
			iteminfo = tds[i].innerText.split('\n')
			items[i] = {
				name: iteminfo[1],
				cost: parseInt(iteminfo[3].replace("Cost: ", "").replace(" NP", "").replace(/\,/g, "")),
			}
			//console.log(items[i])
			ItemDB_price = PriceOnItemDB(items[i].name)
			if(ItemDB_price == undefined) {
				$("td[width='120']:eq(" + i + ")").append('<br><span style="color:red">ItemsDB: ' + 'No Data' + '</span>')
                differs.push('-1000')
				continue;
			}
			var pricedifference = ItemDB_price - items[i].cost
			//console.log(pricedifference)
			differs.push(pricedifference)
			///赋予高亮颜色
			if(pricedifference <= 300) {
				$("td[width='120']:eq(" + i + ")").css('background-color', 'grey')
			}
			if(pricedifference >= 1000 && pricedifference < 3000) {
				$("td[width='120']:eq(" + i + ")").css('background-color', 'darkviolet')
			}
			if(pricedifference >= 3000 && pricedifference < 5000) {
				$("td[width='120']:eq(" + i + ")").css('background-color', 'indianred')
			}
			if(pricedifference >= 5000 && pricedifference < 50000) {
				$("td[width='120']:eq(" + i + ")").css('background-color', 'darkred')
			}
			if(pricedifference >= 50000 && pricedifference < 1000000) {
				$("td[width='120']:eq(" + i + ")").css('background-color', 'goldenrod')
				//window.location.replace(links[i])
			}
			if(pricedifference >= 1000000) {
				$("td[width='120']:eq(" + i + ")").css('background-color', 'gold')
				//window.location.replace(links[i])
			}
			if(pricedifference < 1000 && pricedifference > 300) {
				$("td[width='120']:eq(" + i + ")").css('background-color', 'mediumpurple')
			}
			if(pricedifference < 0) {
				$("td[width='120']:eq(" + i + ")").css('background-color', 'black')
				$("td[width='120']:eq(" + i + ")").css('color', 'white')
			}
			$("td[width='120']:eq(" + i + ")").append('<br>ItemsDB: ' + parse_NP_2_money(ItemDB_price, items[i].name) + ' NP')
			if(check_job(items[i].name)) {
				$("td[width='120']:eq(" + i + ")").css('border', 'purple 5px solid')
				$("td[width='120']:eq(" + i + ")").css('box-sizing', 'border-box')
			}

        }
		if(Math.max.apply(Math, differs) >= 50000) {
			window.location.replace(links[differs.indexOf(Math.max.apply(Math, differs))]);
		}
	}
}

var shop_price = []
var shop_price_type=[]
//自己的商店
function get_shop_price() {
	tds = $("td[width='60'][bgcolor='#ffffcc']")
	currentprice = $('#content > table > tbody > tr > td.content > form:nth-child(14) > table > tbody > tr > td:nth-child(7) > input[type="text"]')
	for(var i = 0; i < tds.length; i++) {
		iteminfo = tds[i].innerText.split('\n')
		itemsname = iteminfo[0]
		//console.log(items[i])
		ItemDB_price = PriceOnItemDB(itemsname)


		if (shop_user_item[itemsname]!=undefined) {
			shop_price.push(shop_user_item[itemsname])
			shop_price_type.push("user")
		}else{
			shop_price.push(ItemDB_price)
			shop_price_type.push("JN")
		}


		item_current_price = currentprice[i].defaultValue
		//console.log(item_current_price)
		if(item_current_price > ItemDB_price * 0.98) {
			$('#content > table > tbody > tr > td.content > form:nth-child(14) > table > tbody > tr:eq(' + (i + 1) + ')').css('color', 'white')
			$('#content > table > tbody > tr > td.content > form:nth-child(14) > table > tbody > tr:eq(' + (i + 1) + ')').children().css('background-color', 'darkred')
		}
		if(item_current_price < ItemDB_price * 0.5) {
			$('#content > table > tbody > tr > td.content > form:nth-child(14) > table > tbody > tr:eq(' + (i + 1) + ')').css('color', 'white')
			$('#content > table > tbody > tr > td.content > form:nth-child(14) > table > tbody > tr:eq(' + (i + 1) + ')').children().css('background-color', 'grey')
		}

		$("td[width='60']:eq(" + i + ")").append('<br>ItemsDB: ' + parse_NP_2_money(ItemDB_price, itemsname) + ' NP')
		//$("td[width='60']:eq(" + i + ")").append('<br>ItemsDB*0.9: ' + parse_NP_2_money(Math.floor(ItemDB_price * 0.9), itemsname) + ' NP')

		if (shop_user_item[itemsname]!=undefined) {
			$("td[width='60']:eq(" + i + ")").append('<br>UserPrice: ' + parse_NP_2_money(shop_user_item[itemsname], itemsname) + ' NP')
		}






	}
	//插入自动定价按钮
	$('a[href="?type=your&order_by=id"]').parent().append('<br><a style="font-size:1.5em;" href="javascript:0" class="price-change">Set Price For All Unpriced</a>')
	$('.price-change').click(function() {
		currentprice = $('#content > table > tbody > tr > td.content > form:nth-child(14) > table > tbody > tr > td:nth-child(7) > input[type="text"]')
		console.log(currentprice)
		for(var i = 0; i < currentprice.length; i++) {
			if(currentprice[i].defaultValue === "0") {
				var new_price = shop_price[i] * 0.95
				if(shop_price[i] > 30000) {
					new_price = shop_price[i] * 0.97
				}
				if(shop_price[i] > 10000 && shop_price[i] <= 30000) {
					new_price = shop_price[i] * 0.94
				}
				if(shop_price[i] <= 10000) {
					new_price = shop_price[i] * 0.91
				}
				new_price = Math.ceil(new_price / 100) * 100 - 2 - 100


				if (shop_price_type[i]=="user") {
					new_price=shop_price[i]
				}
				if(new_price>99999){
					new_price=0
				}



				$("input[maxlength='5']:eq(" + i + ")").val(new_price)
			}
		}

	})
	//插入自动定价按钮--II
	$('a[href="?type=your&order_by=id"]').parent().append('<br><a style="font-size:1.5em;" href="javascript:0" class="price-change-2">Re-Set Price For All</a>')
	$('.price-change-2').click(function() {
		currentprice = $('#content > table > tbody > tr > td.content > form:nth-child(14) > table > tbody > tr > td:nth-child(7) > input[type="text"]')
		console.log(currentprice)
		for(var i = 0; i < currentprice.length; i++) {
			if(true) {
				var new_price = shop_price[i] * 0.95
				if(shop_price[i] > 30000) {
					new_price = shop_price[i] * 0.97
				}
				if(shop_price[i] > 10000 && shop_price[i] <= 30000) {
					new_price = shop_price[i] * 0.94
				}
				if(shop_price[i] <= 10000) {
					new_price = shop_price[i] * 0.91
				}
				new_price = Math.ceil(new_price / 100) * 100 - 2 - 100
				$("input[maxlength='5']:eq(" + i + ")").val(new_price)
			}
		}

	})
}

function check_job(itemname) {
	var check_string = "|Yellow Aisha Plushie|Mashed Eye Potato|Archaesaurus Tail|Hot Dog|Small Yogurt Pea Smoothie|Coconut Keyring|Fajita Chips|Blue Nimmo Plushie|Apple Juice|Gelert Paw Reading|The Grumpy Acara|Potato Wedges|Can of Neocola|Nereid the Water Faerie|Krawk Clacker|Churros|Cup of Tea|Raspberry Milkshake|Straw Sofa|Bargasaurus Steak|Coffee|Fuzzie Bear|Strawberry Milkshake|Purple Wardrobe|Yummy Muddy Pizza|Oozing Chocolate Heart|Pile of Bones|Green Mirror|Pear|Pink Doughnut|Tofu Bone|Top Tuskaninnys|Tan Blush|Sausage and Cheese Roll|De-Slorg Your Farm|Clawmatoe|Gutan Kai|The Macho Kyrii|Golden Vaeolus Statue|Gold Eye Shadow|Nacho Cheese Stuffed Hot Dog|Doirn|Lemon Snow Puff|How to Make Papyrus|Yellow Lenny Plushie|Darien|Green Apple Slushie|Grundo Ballet|Splime Chia Pop|Dark Red Lipstick|Leirobas|Blue Doughnut|Broccoli|Lummock Sendent|Red Mirror|Large Blueberry Tomato Blend Smoothie|Farn Plant|Sugar Coated Lupe Treat|Fluff Be Gone|Starlight Potion|Rainbow Doughnut|Kyrii Grooming Station|Usuki Collectors Guide|Tropical Fruit Smoothie|Simple Red Sofa|Fresh Seaweed Pie|The Wonders of Water|Real Cheese Cheesecake|The Bucket Book|Black Licorice Hearts|Simple Purple Sofa|Joint of Ham|Stream of Light|Candy Fyora Tiara|Pea and Ham Baby Food|Chocolate Moehog Coin|Yellow Chia Plushie|Meerca Menace|Cheese and Salsa Pretzel|Breakfast Tea|Rock Mote|Gormball Stamp|Psellia the Air Faerie|Peppermint Toothpaste|Leek|Strawberry Techo Cookie|Carrot|Fried Chicken Breast|Diet Neocola|Coco NeoCrunch|Purple Invisihat|U-Bend|Bottle of Water|Mystery Island Kougra Stamp|Wind Up Tonu|Mushroom Moisturiser|Mushrolivepepper Pizza|Snowghetti and Meatballs|Red Aisha Plushie|Sir Cheekalot|Fire Snow|Grape Chia Pop|Floral Melted Candle|Beefy Broccoli|Chocolate Cake|Neopia Balloon|Green Eye Shadow|Cherry Pie|Glitter Leaf Candy|Nimmo Gift Ideas|Blue Mouth Wash|Wadjet|Itchy Scratchy Cream|Galactic Adventures|Kreludan Recipes|Fire Jug|Cheeseburger|Present Blocks|Repairing Your Ship|Sugar Doughnut|Kreludan Facts|Arm Shield|Poogle Jacks|NeoPox Pizza|Two Rings Warlock|Neo Taco|Organic Green Apple|Green Hissi Plushie|Desert Petpet Stamp|Red Apple|Simple Red Bed|Blumaroo Gnome-in-the-box|House Blend with Cream|Blue Chia Plushie|Boiled Egg on Toast|Sourdough Baguette|Bluehamberry Burger|Crust-Only Pizza|Bori Dart Game|Peophin Fragrant Soap|Food Shop Chocolate Charm|Green Apple|The Threat Outside|Pumpkin Cookies|Ultra Rubber Gloves|Pink Blush|Super Duper Scooter|Xenia, Master Prankster|Big n Bouncy Toy|Battledome Digest|Balloon Lamp|Breadoch Big Foot|Green Flotsam Plushie|Hot Cakes|Kreludan Fashion|Blueberry Snow Puff|Stone Pot|Simple Blue Lamp|Meaty Pot Pie|Cup of Water|All About Air Faeries|Usuki Box-o-Biscuits|Yam-Lime Pizza|Green Toothbrush|Green Lipstick|Purplum and Cheese Sandwich|House Blend Coffee|Honey and Wheat Baguette|The Grarrl Who Crushed Tyrannia|Chill Pill|Sandwich|Red Origami Gelert|Orange Chia Pop|Biscuit Hot Dog|Earl Grey Tea|Night Stone|The Journal of Jazan|Bacheek|Kougra Tales|Trapped|Small Islandberry Smoothie|Mint Acara Sandwich Cookie|Trilo Bite|Fruity Faerie Fingers|Pineapple Table|Mega Splime Smoothie|Palm Tree Beach Umbrella|Altador Paddleball|Mokti|Mollusc Surprise|Aisha Angel Cookie|Venuquin|Beef Rouladen|Hail Mote|Know Your Collectable Cards|Medicinal Toothbrush|Alabaster|Feathered Friends|Red Satin Collar|Perfume|Brown Eye Shadow|Blueberry Chia Pop|Flotsam Sweater|Ultimate Burger|Orange Melted Candle|Cherry Faerie Bubble|Ice Milk Coffee|White Chocolate Elephante|A Two Rings Crusader|Black Lipstick|Hairspray|Mushroom Toothpaste|White Chocolate Usul|Serpent Scroll|Kraag the Korbat Leader|Small Neggnog Smoothie|Strawberry Snow Puff|Frozen Collar|Hot Mustard Sauce|Voidberry Extract|Chocolate Tuskaninny Cookie|Raspberry Brucicle|White Chocolate Skeith|Know Your Motes|Orange Neodrops|Bitten Green Apple|Cooking with Corn|Defending Your Neohome|Nimmo Combat Guide|Red Lupe Plushie|Breathe|Blue Floss Pick|Nanka Bottle|Watch Out!|Stories from Beyond|Deli Turkey Slices|Large Shepherds Pie Smoothie|Rotting Skeleton Stamp|Faerie Folk|Faerie Toast With Butter|Fire Rice|White Chocolate Aisha|Raspberry Faerie Bubble|Ham|Sick Kyrii|Constellation Spotting|Pumpkin Lip Gloss|Sharpeye|Lollypop Stencil|Plesio|Crimson Ham|Offensive Mopping|Snow Pepper|Banana Cream Coffee|Cherry Twist Lollypop|Flight Attendant Usuki|Organic Peach|Honey Nut Pebbles|Simple Yellow Bed|Red Gelert Plushie|Checkered Cake|Royal Oak Wood Cabinet|Training Your Moehog|Money Tree Stamp|Bar of Soap|Fancy Sundae|Haiki-Lu|Rainbow Breath Mints|Rainbow Chia Pop|Pink Toy Blocks|MegaTon Bracelet|Nest Builders Manual|The Kreludan Flag|Simple Yellow Rug|Golden Sun Chalice|Sky Blue Eye Shadow|Plain Mashed Potato|Quiguki Frenzy|Blue Lipstick|Orange Negg Goo|Boadaisy|Vanilla Acara Sandwich Cookie|Green Doughnut|Meat Feast Pizza|Snow Banana|Small Wheatgrass Fruit Smoothie|Raspberry Jelly A|Collecting Moon Rock|Neowart Fungus|Jalapeno Popper|M*ynci|Cocolatte Slorg Slime|Round Rainbow Table|Quiggle Toothbrush|Blue Toothbrush|Tongue Shrinker|Robot Skeith Stamp|The Big Blue Blumaroo Book|Back In Peaceful Times|Roboto Shoulders|Buttered Crumpet|Small Apple Cinnamon Smoothie|Simple Green Rug|Blue Apple Chia Pop|Sad Peophin Stories|Basic Black Floor Tiles|Two in One Hair Care|Simple Green Sofa|Berry Purple Potpourri|Organic Green Grapes|Carrot Chia Pencil|Red Eye Egg|Simple Yellow Table|Eye-Sha|Golden Khamette Stamp|Ultimate Wocky Manual|Two Rings Archmagus|Deluxe Blue Toothbrush|Bori Gardener Shirt and Overalls|The Faerie Queen Burrito|Purple Sand Rake|Bori Tennis Set|Buzzer|Organic Spring Onion|Dental Floss|Spicy Wings|Rowzez|Wheat Bread Hot Dog|Elephante Eraser|Lupe Sticky Rice Cake|Feed the Skeith Game|Fetch! Stamp|Nautilus|Scorchio Shortcake|Orange Scorchio Cookie|Yellow Flotsam Plushie|Megapepper Pizza|Poogle Marbles|Onion|Small Honey Lemon Smoothie|Lenny Mint Chocolate Chip Ice Cream|Pink Lipstick|Light Faerie Cookie Sandwich|Acaras in History|Advanced Papyrus Making|Tyrannian Kyrii Stamp|Pazo the Lonely Aisha|Strawberry Spike Ball Candy|Baby Doll|Organic Radish|Blue Mynci Plushie|Pteri Spaghetti|Fresh Turnip Sandwich|Gold Mote|Simple Yellow Lamp|Chiazilla|Lupe Warrior|Bori Photo Album|Arnie Hulltusk|Morax Dorangis|Lychee|Spring Onion|Kiwi and Cucumber Sandwich|100 Percent Fake Uni mask|Boraxis the Healer|Midnight Eye Shadow|Snow Days|Cheese and Eel Burger|Candy Floss Chia Pop|Kreludan Cookie Book|Playing with Fire|Ixi Crossing Sign|Neopkins|Yellow Toothbrush|Rolling Chair|Blossom|Forever Ferny|Yellow Elephante Plushie|Disco Paper Yo-Yo|Vegetable Deluxe|Wellington Boots|Black Cherry Slushie|Red Hissi Plushie|Baby Tomatoes|Blue Hissi Plushie|Mud Mote|Underwater Chef|Blue Tropical Mystery Island Flowers Plushie|Tyrela Softpaw|Pink Sprinkle Doughnut|Flatfruit Fruit Leather Socks|Jam Pastry|Simple Blue Side Table|Jelly Slushie|Famous Crab Burger|Mynci Meat Pie|No Need to be Rood|Arrow Cake|Chocolate Milk|Pineapple Slushie|Powdered Green Tea|Pteri Kabob|Furrn|Cobrall|Lightning Gun|Bori Veggie Special|Ryshiki|Shoyru Surprise|Mangorific Slushie|Flower Purse|Pyramid Sun Rise Stamp|ErgyFruit Sour Saucer|Clam Chowder in a Bread Bowl|Quiggle Toothpaste|Small Roasted Chestnut Smoothie|Red Nail Varnish|Factor 30 Sun Tan Lotion|Simple Purple Bed|Green Aisha Plushie|Kacheek Vanilla Pudding|Ugnot|Green!|Lime Slushie|Green Scale|Green Mouth Wash|Assorted Fruits Stamp|Purple Eye Shadow|Fried Egg|Tangy Red Melon Slushie|Milk Chocolate Buzz|Purple Toothbrush|Cactus Leaf|Simple Red Lamp|Organic Red Apple|Traversing The Moon|Vanilla Ice Cream Gummy|Fortune Cookie|Seek Visor|Mustard Ice Cream|Painted Coconut|Little book of puzzles|Tigersquash Sandwich|Long Blue Dress|Iced Borovan|Small Kalery Smoothie|Straw Desk|Erick|Straw Tiki Hat|Simple Red Rug|Brightvale Book Paving Stones|Toy Train|Tangleberry Sour Saucer|Sludgy|Floud|Fire Paper Yo-Yo|Jeuru Stripedmane|Yellow Gormball Sugar Cookies|Red Xweetok Plushie|Strongberry Tea|Red Bean Bag Chair|Bitten Red Apple|Shampoo|Bear|Unguberry Elixir|Lhika Burrtail|Slychi the Skeith Invader|Sack Plant|Caffeine Free Neocola|Koi Pop-Up Book|Mint Lime Flotsam Cake|Large Rasmelon Smoothie|Peanut|How to Make A Pteri Plush Doll|Spyder|Checkered Burger|Tenna|Cactus Blossom|Fire Faerie Pen|Checkered Umbrella|Cinnamon Swirl|Acorn Toy|Balsa Wood Shield|Green Long Hair Brush|Flaming Wuzzle|Orb Plant|Mechanical Pencil|Dried Bamboo Mat|Giant Grarrl Burger|Warf Yoyo|Quiggle Poetry|Cross-Stitch Skeith|Ukkrah the Fire Grarrl|Basic Dryer|Round Notebook|Carrot Lupe Treat|Doctor|Large Ice Creamy Jelly Smoothie|Red Lipstick|Cheese Tortilla|Peophin Shampoo|Orange Cream Techo Truffle|Berserker|Delicious Paste|Spectral Elemental|Sinister Skeith|Mallard|Bronto Bite|Clay Pot"

	var check_arr = check_string.split('|')
	for(var i = 0; i < check_arr.length; i++) {
		if(check_arr[i] === itemname) {
			return true
		}
	}
	return false
}

//保险箱
function get_sdb_price() {
	tds = $("#content > table > tbody > tr > td.content > form > table > tbody > tr > td:nth-child(2) > b")
	for(var i = 0; i < tds.length; i++) {
		iteminfo = tds[i].innerText.split('\n')
		itemsname = iteminfo[0]
		//console.log(items[i])
		ItemDB_price = PriceOnItemDB(itemsname)

		$("#content > table > tbody > tr > td.content > form > table:nth-child(4) > tbody > tr > td:nth-child(2):eq(" + i + ")").append('<br>ItemsDB: ' + parse_NP_2_money(ItemDB_price, itemsname) + ' NP')
		if(ItemDB_price >= 10000 && ItemDB_price < 100000) {
			$("#content > table > tbody > tr > td.content > form > table:nth-child(4) > tbody > tr:eq(" + i + ")").css('background-color', 'palevioletred')
		}
		if(ItemDB_price >= 100000) {
			$("#content > table > tbody > tr > td.content > form > table:nth-child(4) > tbody > tr:eq(" + i + ")").css('background-color', 'goldenrod')
		}
		if(ItemDB_price >= 1000000) {
			$("#content > table > tbody > tr > td.content > form > table:nth-child(4) > tbody > tr:eq(" + i + ")").css('background-color', 'gold')
		}
	}
}

//物品柜
function get_inventory_price() {
	tds = $('#content > table > tbody > tr > td.content > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td')
    var totalm=0
	for(var i = 0; i < tds.length; i++) {
		iteminfo = tds[i].innerText.split('\n')
		itemsname = iteminfo[1]
		//console.log(items[i])
		//console.log(itemsname)
		ItemDB_price = PriceOnItemDB(itemsname)
        if(ItemDB_price<100000){
            totalm+=ItemDB_price
           }
		tds[i].append('\nItemsDB: ' + parse_NP_2_money(ItemDB_price, itemsname) + ' NP')
		if(ItemDB_price >= 10000 && ItemDB_price < 100000) {
			$("#content > table > tbody > tr > td.content > form > table:nth-child(4) > tbody > tr:eq(" + i + ")").css('background-color', 'red')
		}
		if(ItemDB_price >= 100000) {
			$("#content > table > tbody > tr > td.content > form > table:nth-child(4) > tbody > tr:eq(" + i + ")").css('background-color', 'golden')
		}
	}
    console.log(totalm)
}

//拍卖
function get_auction_price() {
	tds = $('#content > table > tbody > tr > td.content > center > table > tbody > tr > td:nth-child(3) > a')
	for(var i = 0; i < tds.length; i++) {
		console.log(tds[i].innerText)
		var item_name = tds[i].innerText
		var current_price = $('#content > table > tbody > tr > td.content > center > table > tbody > tr > td:nth-child(7) > b')[i + 1].innerText
		console.log(current_price)
		var ItemDB_price = PriceOnItemDB(item_name)
		$('#content > table > tbody > tr > td.content > center > table > tbody > tr > td:nth-child(5)' + ':eq(' + (i + 1) + ')').append('\n' + parse_NP_2_money(ItemDB_price, item_name) + ' NP')
		var price_dif = parseInt(current_price) / ItemDB_price
		if(price_dif >= 1.01) {
			$('#content > table > tbody > tr > td.content > center > table > tbody > tr:eq(' + (i + 1) + ')').css('background-color', 'dimgray')
			//$('#content > table > tbody > tr > td.content > center > table > tbody > tr:eq(' + (i + 1) + ')').css('color', 'white')
		}
		if(price_dif >= 0.8 && price_dif < 1.01) {
			$('#content > table > tbody > tr > td.content > center > table > tbody > tr:eq(' + (i + 1) + ')').css('background-color', 'darkgray')
		}
		if(price_dif >= 0.1 && price_dif < 0.3 && ItemDB_price >= 5000) {
			$('#content > table > tbody > tr > td.content > center > table > tbody > tr:eq(' + (i + 1) + ')').css('background-color', 'goldenrod')
		}
	}
}

//交易站
function get_td_price() {
	tds = $('td[align="left"][valign="bottom"]')
	for(var i = 0; i < tds.length; i++) {
		var item_name = tds[i].innerText.replace(' ', '')
		//console.log(item_name)
		var ItemDB_price = PriceOnItemDB(item_name, 1)
		//console.log(PriceOnItemDB(item_name))
		//console.log(ItemDB_price)
		var base_url = "http://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=item_exact&sort_by=newest&search_string="
		var jn_url = "https://items.jellyneo.net/search/?name="
		var ac_url = "http://www.neopets.com/genie.phtml?type=process_genie&criteria=exact&auctiongenie="

		function return_a(url) {
			if(ItemDB_price === undefined) {
				return ""
			}
			if(parseInt(ItemDB_price.replace(/\,/g, '')) > 100000 || parseInt(ItemDB_price.replace(/\,/g, '')) === 0) {
				return ' - ' + '<a href="' + url + '">TP</a>'
			} else {
				return ""
			}

		}

		function return_a_jn(url) {
			if(ItemDB_price === undefined) {
				return ""
			}
			if(parseInt(ItemDB_price.replace(/\,/g, '')) > 100000 || parseInt(ItemDB_price.replace(/\,/g, '')) === 0) {
				return '·' + '<a href="' + url + '&name_type=3' + '">JN</a>'
			} else {
				return ""
			}

		}

		function return_a_ac(url) {
			if(ItemDB_price === undefined) {
				return ""
			}
			if(parseInt(ItemDB_price.replace(/\,/g, '')) > 100000 || parseInt(ItemDB_price.replace(/\,/g, '')) === 0) {
				return '·' + '<a href="' + url + '">AC</a>'
			} else {
				return ""
			}

		}
		var url_name = item_name.replace(/\ /g, '+')

		//tds[i].append('\t\t\t|'+ItemDB_price+' NP'+return_a(base_url+url_name))
		$("td[align='left'][valign='bottom']:eq(" + i + ")").append('<span style="user-select:none;">' + '\t\t\t|' + parse_NP_2_money(ItemDB_price, item_name) + ' NP' + return_a(base_url + url_name) + return_a_ac(jn_url + url_name) + return_a_jn(ac_url + url_name) + '</span>')

	}

	////检查wishlist
	var quick_sale = ["quick", "Quick", "QUICK"]

	var ps = $('p')
	for(var i = 0; i < ps.length; i++) {
		if(ps[i].innerText.indexOf("The Wishlist of") != -1) {
			console.log(ps[i])
			for(var i2 = 0; i2 < quick_sale.length; i2++) {

				if(ps[i].innerText.indexOf(quick_sale[i2]) != -1) {
					$("p:eq(" + i + ")").css("color", "darkred")
				}
			}
		}
	}

}

//返回字符串,给金钱加逗号分隔
function parse_NP_2_money(money, name) {
	var error_item = ["Piece of a treasure map", "Secret Laboratory Map", "Spooky Treasure Map"]
	if($.inArray(name, error_item) != -1) {
		return "Map Item"
	}
	console.log(money)
	if(money == "Inflation Notice") {
		return money
	}

	function money_2_money(money) {

		if(money && money != null) {
			money = String(money);
			var left = money.split('.')[0],
				right = money.split('.')[1];
			right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '';
			var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
			return(Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
		} else if(money === 0) { //注意===在這裡的使用，如果傳入的money為0,if中會將其判定為boolean類型，故而要另外做===判斷
			return '0';
		} else {
			return "";
		}
	};
	return money_2_money(money)

}

function PriceOnItemDB(itemname, mode) {
	if(item_neo[itemname] != undefined) {
		if(mode == 1) {
			return item_neo[itemname].price
		} else {
			return parseInt(item_neo[itemname].price.replace(/\,/g, ''))
		}

	} else {
		return undefined
	}
}

var item_neo = {}

function ParseItemDB() {

	var DBstring = get_string_DB

	items = DBstring.split("|||")
	for(var i = 0; i < items.length; i++) {
		var itemarr = items[i].split(":::")
		if(itemarr[0] != undefined && itemarr[1] != undefined) {
			itemobj = {
				'name': itemarr[0],
				'price': itemarr[1].replace(' NP', ''),
			}
			item_neo[itemarr[0]] = itemobj
		}
	}
	//Save_parsed_ItemDB()

	//}
}

var get_string_DB = GM_getValue("stringDB")
var get_time = GM_getValue("stringDBTime")
var get_json = GM_getValue("DB_json")

console.log(Date.parse(get_time))

if(get_string_DB === undefined) {
	get_string_DB = ''
}

function get_DBstring_from_server() {
	$.ajax({
		type: 'GET',
		url: "http://lichdkimba.tk/storage.txt",
		success: function(data) {
			//console.log(data)
			get_string_DB = data
			GM_setValue("stringDB", get_string_DB)
			GM_setValue("stringDBTime", new Date())
			ParseItemDB()
			GM_setValue("DB_json", JSON.stringify(item_neo))
		},
	});
}

var time_difference = Date.parse(new Date()) - Date.parse(get_time)
console.log("time數據：", time_difference)

if(time_difference > 86400000 || isNaN(time_difference) || time_difference == undefined) {
	console.log('已請求更新數據，需要刷新')
	get_DBstring_from_server()
} else {
	console.log('目前使用已緩存的數據')
}

console.log("get_json:", get_json, get_json.length)

if(get_json === undefined || get_json.length <= 200) {
	console.log("没有有效的JSON")
	ParseItemDB()
	GM_setValue("DB_json", JSON.stringify(item_neo))

} else {
	console.log("读取预解析的JSON")
	item_neo = JSON.parse(get_json)

}
get_td_price()
get()
get_shop_price()
get_sdb_price()
get_inventory_price()
get_auction_price()

//插件设置功能
var c_url = window.location.href;
if(c_url == "http://www.neopets.com/inventory.phtml" || c_url == "https://www.neopets.com/inventory.phtml") {
	$('#invNav').append('<br><a style="font-size:1.5em;" href="javascript:0" class="pochan-setting">Setting - pochan\'s userscript</a>')
	$('.pochan-setting').click(function() {
		$('.content').empty()
		$('.content').html(`
			<span >当前版本-0.8.5</span>
			<!---
		<form id="setting-form">
			在自己商店中除外的物品表(请以"|"分割)
			<br />
			<textarea name="shop-item-ex-list" placeholder="test" form="setting-form"></textarea>
			<br />


			<p>

		</form>
		!--->
		<br>
		在自己商店中设定特定商品的价格(set price时将以此价格转换)
		<br>
		<input id="shop-name" class="code" placeholder="物品名称" required=""> :
				<input id="shop-price" placeholder="物品价格" required="">
				<input type="button" id="add-price" value="添加"></input>
				<div id="c_shop_item"></div>
		<br>
		设定拍卖特定物品的价格(请确认后提交,若有偏差不负责任)
		<br>
						<input id="auc_name" class="code" placeholder="物品名称" required=""> :
				<input id="auc_1_price" placeholder="物品起始价格" required=""> +
				<input id="auc_2_price" placeholder="物品递增价格" required="">
				<input type="button" id="add-price-auc" value="添加"></input>
			<div id="c_auc_item"></div>
		<br>
		<br>
		<br>
		<input type="button" id="to-json" value="转为JSON"></input>
		<textarea id="json-area" rows="3" cols="20"></textarea>
		<br>
		<br>
		<br>		<br>
		<br>
		<br>		<br>
		<br>
		<br>		<br>
		<br>
		<br>
		<input type="button" id="" value="向破产表白"></input>
`);

		var c_html = ""
		for(var key in shop_user_item) {
			c_html += key + ":" + shop_user_item[key] + "<input type='button' item-name='" + key + "' class='del-btn' item-type='shop' value='删除' >" + "<br>"
		}

		$("#c_shop_item").html(c_html)

		var c_html = ""
		for(var key in auc_user_item) {
			c_html += key + ":" + auc_user_item[key]["start_price"] + "+" + auc_user_item[key]["ins_price"] + "<input type='button' item-name='" + key + "' class='del-btn' item-type='auc' value='删除' >" + "<br>"
		}

		$("#c_auc_item").html(c_html)

		$("#add-price").click(function() {

			shop_user_item[$("#shop-name")[0].value] = $("#shop-price")[0].value
			console.log(shop_user_item)
			GM_setValue("shop_json", JSON.stringify(shop_user_item))

			var c_html = ""
			for(var key in shop_user_item) {
				c_html += key + ":" + shop_user_item[key] + "<input type='button' item-name='" + key + "' class='del-btn' item-type='shop'  value='删除' >" + "<br>"
			}
			$("#c_shop_item").html(c_html)
			get_btn_fn()
		})

		$("#add-price-auc").click(function() {

			auc_user_item[$("#auc_name")[0].value]={
				"start_price":$("#auc_1_price")[0].value,
				"ins_price": $("#auc_2_price")[0].value

			}
			console.log(auc_user_item)
			GM_setValue("auc_json", JSON.stringify(auc_user_item))

			var c_html = ""
			for(var key in auc_user_item) {
				c_html += key + ":" + auc_user_item[key]["start_price"] + "+" + auc_user_item[key]["ins_price"] + "<input type='button' item-name='" + key + "' class='del-btn' item-type='auc' value='删除' >" + "<br>"
			}

			$("#c_auc_item").html(c_html)
			get_btn_fn()
		})

		$("#setting-form").change(function() {
			console.log("console.log($('form').serializeArray())")
		});
		get_btn_fn()

		function get_btn_fn() {
			var del_btns = $('.del-btn')
			for(var i = 0; i < del_btns.length; i++) {
				del_btns[i].onclick = function() {
					if($(this).attr("item-type") === "shop") {
						delete shop_user_item[$(this).attr("item-name")]
						GM_setValue("shop_json", JSON.stringify(shop_user_item))
						$(this).before("已删除")
						$(this).css("display", "none")

					}
					if($(this).attr("item-type") === "auc") {
						delete auc_user_item[$(this).attr("item-name")]
						GM_setValue("auc_json", JSON.stringify(auc_user_item))
						$(this).before("已删除")
						$(this).css("display", "none")

					}

				}
			}
		}


		$("#to-json").click(function(){
			var setting={
				"shop_json":shop_user_item,
				"auc_json":auc_user_item,
			}
			console.log(JSON.stringify(setting))
			$("#json-area").append(JSON.stringify(setting))

		})








	})
}






