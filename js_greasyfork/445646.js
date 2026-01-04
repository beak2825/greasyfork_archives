// ==UserScript==
// @name        Quick equip item
// @description Quickly equip items
// @namespace   m0tch.torn.QuickEquipItems
// @match       https://www.torn.com/item.php*
// @run-at      document-end
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @version     0.2.1
// @author      m0tch
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/445646/Quick%20equip%20item.user.js
// @updateURL https://update.greasyfork.org/scripts/445646/Quick%20equip%20item.meta.js
// ==/UserScript==

GM_addStyle(`
.quick-items > .content > * {
	margin: 2px 5px;
	padding: 5px;
}

.quick-item-container {
	display: inline-block;
    background: linear-gradient(180deg,rgba(0,0,0,.07),rgba(0,0,0,.01));
    border: 2px solid white;
    position: relative;
}

.quick-item-container:hover {
	cursor: pointer;
    background: white;
}

.quick-items .header {
	background: linear-gradient(180deg,#555,#333) no-repeat;
	padding: 0;
	margin: 0;
    border-radius: 5px 5px 0 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 34px;
    position: relative;
}

.quick-items .header .icons {
	display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-left: auto;
}

.quick-items .header .icons button {
	color: rgb(153, 153, 153);
}
.quick-items .header .icons button:before {
	background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0));
}
.quick-items .header .icons button:hover {
	color: white;
    cursor: pointer;
}

.quick-items .title {
	-ms-flex-item-align: center;
    -ms-grid-row-align: center;
    align-self: center;
    color: #fff;
    font: 700 12px/14px Arial,sans-serif;
    margin-left: 10px;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    text-shadow: 0 0 2px #000;
    white-space: nowrap;
}

.quick-items .content {
	background-color: var(--default-bg-panel-color);
    border-radius: 0 0 5px 5px;
	padding: 5px;
    -webkit-box-shadow: 0 1px 0 var(--loadouts-default-white-box-shadow-color);
    box-shadow: 0 1px 0 var(--loadouts-default-white-box-shadow-color);
}

.quick-item-pic {
    width: 60px;
    height: 30px;
    background-size: cover;
    margin: auto;
}

.quick-item-remove {
    position: absolute;
    top: 3px;
    right: 3px;
    color: rgb(167, 167, 167);
}

.quick-item-button {
    min-width: 30px;
    position: relative;
    margin: auto;
    border-left: 2px solid transparent;
    height: 100%;
}

.quick-item-button:hover {
    cursor: pointer;
}

.quick-item-button:hover svg {
    fill: #fff;
}

.quick-item-button:before {
    background: -webkit-gradient(linear,left top,left bottom,from(rgba(0,0,0,0)),color-stop(50%,rgba(0,0,0,.502)),to(rgba(0,0,0,0)));
    background: -o-linear-gradient(top,rgba(0,0,0,0) 0,rgba(0,0,0,.502) 50%,rgba(0,0,0,0) 100%);
    background: linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.502) 50%,rgba(0,0,0,0));
    bottom: 0;
    content: "";
    left: -1px;
    position: absolute;
    top: 0;
    width: 1px;
}

.add-quick-item-button:hover {
    cursor: pointer;
}

#newItemInput {
    margin-right: 5px;
    height: 24px;
    border-radius: 5px;
    padding: 0px 5px;

}

#newItemContainer {
    padding-left: 0px;
}


`);

let quickItems = [
    { "xid": "220", "name": "Grenade", "type": "Temporary" },
    { "xid": "221", "name": "Stick Grenade", "type": "Temporary" },
    { "xid": "222", "name": "Flash Grenade", "type": "Temporary" },
    { "xid": "226", "name": "Smoke Grenade", "type": "Temporary" },
    { "xid": "229", "name": "Claymore Mine", "type": "Temporary" },
    { "xid": "239", "name": "Ninja Star", "type": "Temporary" },
    { "xid": "242", "name": "HEG", "type": "Temporary" },
    { "xid": "246", "name": "Fireworks", "type": "Temporary" },
    { "xid": "256", "name": "Tear Gas", "type": "Temporary" },
    { "xid": "257", "name": "Throwing Knife", "type": "Temporary" },
    { "xid": "392", "name": "Pepper Spray", "type": "Temporary" },
    { "xid": "394", "name": "Brick", "type": "Temporary" },
    { "xid": "463", "name": "Epinephrine", "type": "Temporary" },
    { "xid": "464", "name": "Melatonin", "type": "Temporary" },
    { "xid": "465", "name": "Serotonin", "type": "Temporary" },
    { "xid": "581", "name": "Book", "type": "Temporary" },
    { "xid": "611", "name": "Snowball", "type": "Temporary" },
    { "xid": "616", "name": "Trout", "type": "Temporary" },
    { "xid": "742", "name": "Molotov Cocktail", "type": "Temporary" },
    { "xid": "814", "name": "Tyrosine", "type": "Temporary" },
    { "xid": "833", "name": "Sand", "type": "Temporary" },
    { "xid": "840", "name": "Nail Bomb", "type": "Temporary" },
    { "xid": "847", "name": "Nerve Gas", "type": "Temporary" },
    { "xid": "1042", "name": "Concussion Grenade", "type": "Temporary" },
    { "xid": "1054", "name": "Semtex", "type": "Temporary" },
    { "xid": "1178", "name": "Party Popper", "type": "Temporary" },
    { "xid": "1294", "name": "Glitter Bomb", "type": "Temporary" },

    { "xid": "196", "name": "Cannabis", "type": "Drug" },
    { "xid": "197", "name": "Ecstasy", "type": "Drug" },
    { "xid": "198", "name": "Ketamine", "type": "Drug" },
    { "xid": "199", "name": "LSD", "type": "Drug" },
    { "xid": "200", "name": "Opium", "type": "Drug" },
    { "xid": "201", "name": "PCP", "type": "Drug" },
    { "xid": "203", "name": "Shrooms", "type": "Drug" },
    { "xid": "204", "name": "Speed", "type": "Drug" },
    { "xid": "205", "name": "Vicodin", "type": "Drug" },
    { "xid": "206", "name": "Xanax", "type": "Drug" },
    { "xid": "870", "name": "Love Juice", "type": "Drug" },

    { "xid": "180", "name": "Bottle of Beer", "type": "Alcohol" },
    { "xid": "181", "name": "Bottle of Champagne", "type": "Alcohol" },
    { "xid": "294", "name": "Bottle of Sake", "type": "Alcohol" },
    { "xid": "426", "name": "Bottle of Tequila", "type": "Alcohol" },
    { "xid": "531", "name": "Bottle of Pumpkin Brew", "type": "Alcohol" },
    { "xid": "541", "name": "Bottle of Stinky Swamp Punch", "type": "Alcohol" },
    { "xid": "542", "name": "Bottle of Wicked Witch", "type": "Alcohol" },
    { "xid": "550", "name": "Bottle of Kandy Kane", "type": "Alcohol" },
    { "xid": "551", "name": "Bottle of Minty Mayhem", "type": "Alcohol" },
    { "xid": "552", "name": "Bottle of Mistletoe Madness", "type": "Alcohol" },
    { "xid": "638", "name": "Bottle of Christmas Cocktail", "type": "Alcohol" },
    { "xid": "816", "name": "Glass of Beer", "type": "Alcohol" },
    { "xid": "873", "name": "Bottle of Green Stout", "type": "Alcohol" },
    { "xid": "924", "name": "Bottle of Christmas Spirit", "type": "Alcohol" },
    { "xid": "984", "name": "Bottle of Moonshine", "type": "Alcohol" },

    { "xid": "66", "name": "Morphine", "type": "Medical" },
    { "xid": "67", "name": "First Aid Kit", "type": "Medical" },
    { "xid": "68", "name": "Small First Aid Kit", "type": "Medical" },
    { "xid": "361", "name": "Neumune Tablet", "type": "Medical" },
    { "xid": "699", "name": "Antidote", "type": "Medical" },
    { "xid": "731", "name": "Empty Blood Bag", "type": "Medical" },
    { "xid": "732", "name": "Blood Bag : A+", "type": "Medical" },
    { "xid": "733", "name": "Blood Bag : A-", "type": "Medical" },
    { "xid": "734", "name": "Blood Bag : B+", "type": "Medical" },
    { "xid": "735", "name": "Blood Bag : B-", "type": "Medical" },
    { "xid": "736", "name": "Blood Bag : AB+", "type": "Medical" },
    { "xid": "737", "name": "Blood Bag : AB-", "type": "Medical" },
    { "xid": "738", "name": "Blood Bag : O+", "type": "Medical" },
    { "xid": "739", "name": "Blood Bag : O-", "type": "Medical" },
    { "xid": "796", "name": "Felovax", "type": "Medical" },
    { "xid": "797", "name": "Zylkene", "type": "Medical" },
    { "xid": "804", "name": "Duke's Herpes Medication", "type": "Medical" },
    { "xid": "1012", "name": "Blood Bag : Irradiated", "type": "Medical" },

    { "xid": "530", "name": "Can of Munster", "type": "Energy Drink" },
    { "xid": "532", "name": "Can of Red Cow", "type": "Energy Drink" },
    { "xid": "533", "name": "Can of Taurine Elite", "type": "Energy Drink" },
    { "xid": "553", "name": "Can of Santa Shooters", "type": "Energy Drink" },
    { "xid": "554", "name": "Can of Rockstar Rudolph", "type": "Energy Drink" },
    { "xid": "555", "name": "Can of X-MASS", "type": "Energy Drink" },
    { "xid": "985", "name": "Can of Goose Juice", "type": "Energy Drink" },
    { "xid": "986", "name": "Can of Damp Valley", "type": "Energy Drink" },
    { "xid": "987", "name": "Can of Crocozade", "type": "Energy Drink" },

    { "xid": "35", "name": "Box of Chocolate Bars", "type": "Candy" },
    { "xid": "36", "name": "Big Box of Chocolate Bars", "type": "Candy" },
    { "xid": "37", "name": "Bag of Bon Bons", "type": "Candy" },
    { "xid": "38", "name": "Box of Bon Bons", "type": "Candy" },
    { "xid": "39", "name": "Box of Extra Strong Mints", "type": "Candy" },
    { "xid": "151", "name": "Pixie Sticks", "type": "Candy" },
    { "xid": "209", "name": "Box of Sweet Hearts", "type": "Candy" },
    { "xid": "210", "name": "Bag of Chocolate Kisses", "type": "Candy" },
    { "xid": "310", "name": "Lollipop", "type": "Candy" },
    { "xid": "472", "name": "Blue Easter Egg", "type": "Candy" },
    { "xid": "473", "name": "Green Easter Egg", "type": "Candy" },
    { "xid": "474", "name": "Red Easter Egg", "type": "Candy" },
    { "xid": "475", "name": "Yellow Easter Egg", "type": "Candy" },
    { "xid": "476", "name": "White Easter Egg", "type": "Candy" },
    { "xid": "477", "name": "Black Easter Egg", "type": "Candy" },
    { "xid": "478", "name": "Gold Easter Egg", "type": "Candy" },
    { "xid": "527", "name": "Bag of Candy Kisses", "type": "Candy" },
    { "xid": "528", "name": "Bag of Tootsie Rolls", "type": "Candy" },
    { "xid": "529", "name": "Bag of Chocolate Truffles", "type": "Candy" },
    { "xid": "556", "name": "Bag of Reindeer Droppings", "type": "Candy" },
    { "xid": "583", "name": "Brown Easter Egg", "type": "Candy" },
    { "xid": "584", "name": "Orange Easter Egg", "type": "Candy" },
    { "xid": "585", "name": "Pink Easter Egg", "type": "Candy" },
    { "xid": "586", "name": "Jawbreaker", "type": "Candy" },
    { "xid": "587", "name": "Bag of Sherbet", "type": "Candy" },
    { "xid": "634", "name": "Bag of Bloody Eyeballs", "type": "Candy" },
    { "xid": "1028", "name": "Birthday Cupcake", "type": "Candy" },
    { "xid": "1039", "name": "Bag of Humbugs", "type": "Candy" },
    { "xid": "1149", "name": "Purple Easter Egg", "type": "Candy" },

    { "xid": "106", "name": "Parachute", "type": "Booster" },
    { "xid": "329", "name": "Skateboard", "type": "Booster" },
    { "xid": "330", "name": "Boxing Gloves", "type": "Booster" },
    { "xid": "331", "name": "Dumbbells", "type": "Booster" },
    { "xid": "366", "name": "Erotic DVD", "type": "Booster" },
    { "xid": "367", "name": "Feathery Hotel Coupon", "type": "Booster" },
    { "xid": "368", "name": "Lawyer Business Card", "type": "Booster" },
    { "xid": "561", "name": "Book of Carols", "type": "Booster" },
    { "xid": "563", "name": "Gift Card", "type": "Booster" },

    { "xid": "403", "name": "Box of Tissues", "type": "Other" }
];

function JSONparse(str) {
	try {
		return JSON.parse(str);
	} catch (e) {}
	return null;
}

if(!localStorage["quickitems.items"]){
    var items = [{name: "Brick", xid: 394}];
    localStorage["quickitems.items"] = 	JSON.stringify(items);
}

/*
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 420
{"status":false,"message":"Something wrong with the API Call. Error code: Your key is currently timed out. Please wait a few minutes before trying again."}
*/

function loadQuickItemPanel(node) {
	if (!node) return;

	node.style.position = "relative";

	let panelNode = document.createElement("div");
	panelNode.className = "text quick-items";

	panelNode.appendChild(loadPanelHeader());

    let quickItems = JSONparse(localStorage["quickitems.items"]);

	let contentNode = document.createElement("div");
	contentNode.className = "content";
    contentNode.id = "quickItemContent";
	panelNode.appendChild(contentNode);

	contentNode.appendChild(loadAddToQuickItemsButton());

    quickItems.forEach(item => contentNode.appendChild(loadQuickItemButton(item)));

	let divider = document.createElement("hr");
	divider.className = "delimiter-999 m-top10 m-bottom10";
	node.insertBefore(divider, node.children[2]);
	node.insertBefore(panelNode, divider);
}

function loadAddToQuickItemsButton(){
	let addNewItemContainer = document.createElement("div");
	addNewItemContainer.id = "newItemContainer";
	addNewItemContainer.style = "display:none;";

    let datalist = document.createElement("datalist");
    datalist.id = "itemlist";

    let resultstemplate = document.createElement("template");
    resultstemplate.id = "resultstemplate";
    quickItems.forEach((item) => {
        let itemOption = document.createElement("option");
        itemOption.value = item.name;
        resultstemplate.appendChild(itemOption);
    });
    addNewItemContainer.appendChild(resultstemplate);

    addNewItemContainer.appendChild(datalist);


    let newItemInput = document.createElement("input");
    newItemInput.id = "newItemInput";
    newItemInput.setAttribute("autocomplete", "off");
    newItemInput.setAttribute("list", datalist.id);
    newItemInput.setAttribute("placeholder", "Search...");
    addNewItemContainer.appendChild(newItemInput);

    let newItemButton = document.createElement("button");
	newItemButton.textContent = " Add Quick Item";
    newItemButton.className = "add-quick-item-button";
	newItemButton.style = "text-align:center;";

	addNewItemContainer.appendChild(newItemButton);

    newItemButton.addEventListener("click", () => {
        addItem(newItemInput.value);
        newItemInput.value = "";
	});

    newItemInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addItem(newItemInput.value);
            newItemInput.value = "";
        }
        else {
            while (datalist.children.length) datalist.removeChild(datalist.firstChild);
            var clonedOptions = resultstemplate.cloneNode(true);
            var set = Array.prototype.reduce.call(clonedOptions.children, function searchFilter(frag, el) {
                if (el.value.toLowerCase().indexOf(newItemInput.value.trim().toLowerCase()) >= 0 && frag.children.length < 5) frag.appendChild(el);
                return frag;
            }, document.createDocumentFragment());
            datalist.appendChild(set);
        }
    });

	addNewItemContainer.appendChild(document.createElement("br"));

    return addNewItemContainer;
}

function addItem(inputValue) {
    let specifiedItems = quickItems.filter((x) => {
        return x.name.trim().toLowerCase().indexOf(inputValue.trim().toLowerCase()) >= 0;
    });
    if(specifiedItems.length > 0){
        let newItem = specifiedItems[0];
        let existingSet = JSONparse(localStorage["quickitems.items"]);
        let existingItemIndex = existingSet.findIndex(item => item.xid === newItem.xid);
        if (existingItemIndex === -1){
            let contentNode = document.getElementById("quickItemContent");
            contentNode.appendChild(loadQuickItemButton(newItem, true));
            persistNewItem(newItem);
        }
    }
}

function persistNewItem(item){
    let existingSet = JSONparse(localStorage["quickitems.items"]);
    let newSet = [...existingSet, item];
    localStorage["quickitems.items"] = JSON.stringify(newSet);
}

function loadPanelHeader(){
	let header = document.createElement("div");
	header.className = "header";
    let itemLabel = document.createElement("span");
	itemLabel.className = "title";
	itemLabel.textContent = "Quick Items";
	header.appendChild(itemLabel);

	let buttons = document.createElement("nav");
	buttons.className = "icons";
	let editButton = document.createElement("button");
    editButton.className = "quick-item-button";
	editButton.innerText = " Edit ";
	buttons.appendChild(editButton);
	header.appendChild(buttons);

    let hideButton = document.createElement("button");
    hideButton.className = "quick-item-button";
    let hideIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    hideIcon.setAttribute('fill', "#999");
    hideIcon.setAttribute('flood-color', '#999');
    hideIcon.setAttribute("stroke", "#fff");
    hideIcon.setAttribute("stroke-width", "0");
    hideIcon.setAttribute("width", "16");
    hideIcon.setAttribute("height", "11");
    hideIcon.setAttribute("viewBox", "0 0 16 11");
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M1302,21l-5,5V16Z")
    path.setAttribute("transform", "translate(29 -1294) rotate(90)");
    hideIcon.appendChild(path);
    hideButton.appendChild(hideIcon);

    hideButton.addEventListener("click", () => {
        let content = document.getElementById("quickItemContent");
        if (content.style.display === "none"){
			content.style.display = "block";
            header.style = "border-radius: 5px 5px 0px 0px;";
            hideIcon.setAttribute("width", "16");
            hideIcon.setAttribute("height", "11");
            hideIcon.setAttribute("viewBox", "0 0 16 11");
            path.setAttribute("transform", "translate(29 -1294) rotate(90)");
		} else {
			content.style.display = "none";
            header.style = "border-radius: 5px 5px 5px 5px;";
            hideIcon.setAttribute("width", "11");
            hideIcon.setAttribute("height", "16");
            hideIcon.setAttribute("viewBox", "0 0 11 16");
            path.setAttribute("transform", "translate(-1294, -13)");
		}
    });
    buttons.appendChild(hideButton);

    editButton.addEventListener("click", (event) => {
        event.stopPropagation();
		let newItemContainer = document.getElementById("newItemContainer");
		if (newItemContainer.style.display === "none"){
			newItemContainer.style.display = "block";
            document.getElementById("newItemInput").focus();
		} else {
			newItemContainer.style.display = "none";
		}
		let removeIcons = document.querySelectorAll(".quick-item-remove");
		if (removeIcons && removeIcons[0].style.display === "none"){
			removeIcons.forEach(x => {
                x.style.display = "inline-block";
            });
		} else {
			removeIcons.forEach(x => {
                x.style.display = "none";
            });
		}
	});
    return header;
}

function loadQuickItemButton(item, isNew = false){
	let container = document.createElement("div");
	container.className = "quick-item-container";
    container.dataset.xid = item.xid;
    container.dataset.type = item.type;
	let pic = document.createElement("div");
	pic.style = "background-image: url(/images/items/" + item.xid + "/medium.png)";
	pic.className = "quick-item-pic";

    let itemLabel = document.createElement("p");
	itemLabel.textContent = item.name;
	itemLabel.style = "width:100%;text-align:center"

    let removeIcon = document.createElement("p");
    removeIcon.className = "quick-item-remove";
    removeIcon.innerText = "✖";
    removeIcon.style.display = isNew ? "inline-block" : "none";

    removeIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        persistItemRemoval(container.dataset);
        container.remove();
	});

	container.appendChild(pic);
	container.appendChild(itemLabel);
    container.appendChild(removeIcon);

    container.addEventListener("click", () => {
        if (item.type == "Temporary"){
            equipItem(item).then(response => {
                loadouts.actions.getEquippedItemsRequestAction();
            });
        } else {
            useItem(item).then(response => {
                console.log(response);
            });
        }
	});
    return container;
}

function persistItemRemoval(item){
    let existingSet = JSONparse(localStorage["quickitems.items"]);
    let newSet = existingSet.filter(x => x.xid != item.xid).slice();
    localStorage["quickitems.items"] = JSON.stringify(newSet);
    console.log("Quick Items: " + localStorage["quickitems.items"]);
}

function equipItem(item){
    const body = new URLSearchParams();
    Object.entries({ step: "actionForm", confirm: 1, action: "equip", type: 5, id: item.xid, item_id: item.xid }).forEach(
        ([key, value]) => body.set(key, value)
    );
    const params = new URLSearchParams();

    //const url = { action: "item.php", method: "POST", body };
    params.set("rfcv", getRFC());
    const fullUrl = `https://www.torn.com/item.php${params.toString() ? "?" + params : ""}`;
    const headers = {};

    headers["x-requested-with"] = "XMLHttpRequest";
    let parameters = { method: "POST", headers, body };

	return fetch(fullUrl, { ...parameters });
}

function useItem(item){
    const body = new URLSearchParams();
    Object.entries({ step: "useItem", id: item.xid, itemID: item.xid }).forEach(
        ([key, value]) => body.set(key, value)
    );
    const params = new URLSearchParams();

    //const url = { action: "item.php", method: "POST", body };
    params.set("rfcv", getRFC());
    const fullUrl = `https://www.torn.com/item.php${params.toString() ? "?" + params : ""}`;
    const headers = {};

    headers["x-requested-with"] = "XMLHttpRequest";
    let parameters = { method: "POST", headers, body };

    return fetch(fullUrl, { ...parameters })
}

function getCookie(cname) {
	const name = cname + "=";

	for (let cookie of decodeURIComponent(document.cookie).split(";")) {
		cookie = cookie.trimLeft();

		if (cookie.includes(name)) {
			return cookie.substring(name.length);
		}
	}
	return "";
}

function getRFC() {
	const rfc = getCookie("rfc_v");
	if (!rfc) {
		for (let cookie of document.cookie.split("; ")) {
			cookie = cookie.split("=");
			if (cookie[0] === "rfc_v") {
				return cookie[1];
			}
		}
	}
	return rfc;
}

loadQuickItemPanel(document.querySelector(".main-items-cont-wrap"));

new MutationObserver(mutations => {
	mutations.forEach(mutation => {
		for (const node of mutation.addedNodes) {
            loadQuickItemPanel(node.querySelector && node.querySelector(".main-items-cont-wrap"));
		}
	});
}).observe(document.body, {childList: true, subtree: true});