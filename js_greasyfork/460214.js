// ==UserScript==
// @name         Crown Progress Explorer
// @namespace    https://greasyfork.org/users/1028985
// @version      0.0
// @description  A different but simple new way to look at your progress
// @author       CMT
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @downloadURL https://update.greasyfork.org/scripts/460214/Crown%20Progress%20Explorer.user.js
// @updateURL https://update.greasyfork.org/scripts/460214/Crown%20Progress%20Explorer.meta.js
// ==/UserScript==

((function () {
	'use strict';
    const mouseCats = [
        {type:"Arcane",
        mice: ["Buccaneer Mouse","Hapless Marionette"]},
        {type:"Draconic",
        mice: ["Chameleon Mouse","Dragon Mouse","Dumpling Chef Mouse"]},
        {type:"Forgotten",
        mice: ["Acolyte Mouse","Balack the Banished"]},
        {type:"Hydro",
        mice: ["Aged Mouse","Briegull Mouse","Black Widow Mouse"]},
        {type:"Law",
        mice: ["Bandit Mouse","Gate Guardian Mouse","Gold Mouse"]},
        {type:"Parental",
        mice: ["Aged Mouse"]},
        {type:"Physical",
        mice: ["Abominable Snow Mouse","Bear Mouse"]},
        {type:"Rift",
        mice: ["Fairy Mouse","Fiddler Mouse","Gate Guardian Mouse"]},
        {type:"Shadow",
        mice: ["Aquos Mouse","Bionic Mouse"]},
        {type:"Tactical",
        mice: ["Alchemist Mouse","Alnilam Mouse","Assassin Mouse"]}
    ]
    let defMouseScore =
        {Arcane: 0,
        Draconic: 0,
        Forgotten: 0,
        Hydro: 0,
        Law:0,
        Parental: 0,
        Physical : 0,
        Rift: 0,
        Shadow: 0,
        Tactical:0
    }
	let defMouseTypeList = {Arcane: [],
        Draconic: [],
        Forgotten: [],
        Hydro: [],
        Law:[],
        Parental: [],
        Physical : [],
        Rift: [],
        Shadow: [],
        Tactical:[]
    }
	let mouseTypeList, mouseScore;
	/**
	 * Add styles to the page.
	 *
	 * @param {string} styles The styles to add.
	 */
	const addStyles = (styles) => {
		// Check to see if the existing element exists.
		const existingStyles = document.getElementById('mh-mouseplace-custom-styles');

		// If so, append our new styles to the existing element.
		if (existingStyles) {
			existingStyles.innerHTML += styles;
			return;
		}

		// Otherwise, create a new element and append it to the head.
		const style = document.createElement('style');
		style.id = 'cmt-styles';
		style.innerHTML = styles;
		document.head.appendChild(style);
	};
	/**
	 * POST a request to the server and return the response.
	 *
	 * @param {string} url      The url to post to, not including the base url.
	 * @param {Object} formData The form data to post.
	 *
	 * @return {Promise} The response.
	 */
	const doRequest = async (url, formData) => {
		// If we don't have the needed params, bail.
		if ('undefined' === typeof user || ! user || 'undefined' === typeof user.unique_hash || ! user.unique_hash) { // eslint-disable-line no-undef
			return;
		}

		// Build the form for the request.
		const form = new FormData();
		form.append('sn', 'Hitgrab');
		form.append('hg_is_ajax', 1);
		form.append('uh', user.unique_hash ? user.unique_hash : ''); // eslint-disable-line no-undef

		// Add in the passed in form data.
		for (const key in formData) {
			form.append(key, formData[ key ]);
		}

		// Convert the form to a URL encoded string for the body.
		const requestBody = new URLSearchParams(form).toString();

		// Send the request.
		const response = await fetch(
			callbackurl ? callbackurl + url : 'https://www.mousehuntgame.com/' + url, // eslint-disable-line no-undef
			{
				method: 'POST',
				body: requestBody,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

		// Wait for the response and return it.
		const data = await response.json();
		return data;
	};

	/**
	 *  Add a submenu item to a menu.
	 *
	 * @param {Object} options The options for the submenu item.
	 */
	const addSubmenuItem = (options) => {
		// Default to sensible values.
		const settings = Object.assign({}, {
			menu: 'kingdom',
			label: '',
			icon: '',
			href: '',
			callback: null,
			external: false,
		}, options);


		// Grab the menu item we want to add the submenu to.
		const menuTarget = document.querySelector(`.mousehuntHud-menu .${ settings.menu }`);
		if (! menuTarget) {
			return;
		}

		// If the menu already has a submenu, just add the item to it.
		if (! menuTarget.classList.contains('hasChildren')) {
			menuTarget.classList.add('hasChildren');
		}

		let submenu = menuTarget.querySelector('ul');
		if (! submenu) {
			submenu = document.createElement('ul');
			menuTarget.appendChild(submenu);
		}

		// Create the item.
		const item = document.createElement('li');

		// Add in our class.
		const menuSlug = settings.label.toLowerCase().replace(/ /g, '-');
		item.classList.add(`mh-submenu-item-${ menuSlug }`);

		if (settings.icon) {
			addStyles(`.mousehuntHud-menu .mh-submenu-item-${ menuSlug } .icon { background-image: url(${ settings.icon }); }`);
		}

		// Create the link.
		const link = document.createElement('a');
		link.href = settings.href || '#';

		if (settings.callback) {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				settings.callback();
			});
		}

		// Create the icon.
		const icon = document.createElement('div');
		icon.classList.add('icon');

		// Create the label.
		const name = document.createElement('div');
		name.classList.add('name');
		name.innerText = settings.label;

		// Add the icon and label to the link.
		link.appendChild(icon);
		link.appendChild(name);

		// If it's an external link, also add the icon for it.
		if (settings.external) {
			const externalLinkIcon = document.createElement('div');
			externalLinkIcon.classList.add('external_icon');
			link.appendChild(externalLinkIcon);

			// Set the target to _blank so it opens in a new tab.
			link.target = '_blank';
			link.rel = 'noopener noreferrer';
		}

		// Add the link to the item.
		item.appendChild(link);

		// Add the item to the submenu.
		submenu.appendChild(item);
	};
	/**
	 * Get the mouse stats.
	 *
	 * @return {Object} The mouse stats.
	 */
	const getMouseStats = async () => {
		const data = await doRequest(
			'managers/ajax/mice/getstat.php',
			{
				action: 'get_hunting_stats',
			}
		);

		// Grab the data from the response.
		const mouseData = data?.hunting_stats


		// Return the data.
		return mouseData ? mouseData : [];
	};

    const calculateScore = (stats) => {
		mouseScore = JSON.parse(JSON.stringify(defMouseScore));
		mouseTypeList = JSON.parse(JSON.stringify(defMouseTypeList));
        stats.forEach((mouse) => {
            mouseCats.forEach((cat) => {
                if (cat.mice.includes(mouse.name)){
					if(mouse.num_catches >= 100){
						mouseScore[cat.type] = mouseScore[cat.type] +1
					}
					mouseTypeList[cat.type].push(mouse);
                }
            })
        })
    }

    const buildScoreMarkup = (type)=>{
        for (const cat in mouseCats){
            if (mouseCats[cat].type == type){
                const typeEl = document.createElement('a');
                typeEl.classList.add('cmt-mice-stats');
                typeEl.title = type;
                // Create the image element.
                const image = document.createElement('div');
                image.classList.add('cmt-mice-stats-image');
                image.style.backgroundImage = `url('https://www.mousehuntgame.com/images/powertypes/${type.toLowerCase()}.png')`;
                // Create the name element.
                const name = document.createElement('div');
                name.classList.add('cmt-mice-stats-name');
                name.innerText = type;
                // Create a wrapper for the name and image.
                const imageNameContainer = document.createElement('div');
                imageNameContainer.appendChild(image);
                imageNameContainer.appendChild(name);
				// Create a flat element
				const flat = document.createElement('div');
				flat.classList.add('cmt-mice-stats-catches');
                let flatnumber = mouseScore[type] + " / " + (mouseCats[cat]["mice"].length);
				flat.innerText = flatnumber;
                // Create the percentage element.
                const percentage = document.createElement('div');
                percentage.classList.add('cmt-mice-stats-catches');
                let number = (100*mouseScore[type]/(mouseCats[cat]["mice"].length)).toFixed(3);
                percentage.innerText = number + "%";
                // Add the image and name to the type element.
                typeEl.appendChild(imageNameContainer);
				typeEl.appendChild(flat);
                typeEl.appendChild(percentage);


                // console.log(100*mouseScore[type]/(mouseCats[cat]["mice"].length))
                return typeEl;

            }
        }
    }
    	/**
	 * Show the stat modal.
	 */
	const showModal = async () => {
		// First, check to make sure we have the element we want to append to.
		const target = document.querySelector('.pageFrameView-content');
		if (! target) {
			return;
		}

		// Remove the existing modal.
		const existing = document.getElementById('cmt-mice-stats');
		if (existing) {
			existing.remove();
		}

		// Create the modal.
		const modalWrapper = document.createElement('div');
		modalWrapper.id = 'cmt-mice-stats';

		// Create the wrapper.
		const modal = document.createElement('div');
		modal.classList.add('cmt-mice-stats-wrapper');

		// Create the header.
		const header = document.createElement('div');
		header.classList.add('cmt-mice-stats-header');

		// Add the title;
		const title = document.createElement('h1');
		title.innerText = 'Mouse Catch Stats';
		header.appendChild(title);

		// Create a close button icon.
		const closeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		closeIcon.classList.add('cmt-mice-stats-close');
		closeIcon.setAttribute('viewBox', '0 0 24 24');
		closeIcon.setAttribute('width', '18');
		closeIcon.setAttribute('height', '18');
		closeIcon.setAttribute('fill', 'none');
		closeIcon.setAttribute('stroke', 'currentColor');
		closeIcon.setAttribute('stroke-width', '1.5');

		// Create the path.
		const closePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		closePath.setAttribute('d', 'M18 6L6 18M6 6l12 12');
		closeIcon.appendChild(closePath);

		// Close the modal when the icon is clicked.
		closeIcon.addEventListener('click', () => {
			modalWrapper.remove();
		});

		// Append the button.
		header.appendChild(closeIcon);

		// Add the header to the modal.
		modal.appendChild(header);
//-----
		// Make the mouse stats table.
		const mouseBody = document.createElement('div');
		mouseBody.classList.add('cmt-mice-stats-body');
		// TODO: add column headers
		const mouseHeaders = document.createElement('div');
		mouseHeaders.classList.add('cmt-mice-stats');
		const mouseImageHeader = document.createElement('div');
		const mouseNameHeader = document.createElement('div');
		const mouseFlatHeader = document.createElement('div');
		const mousePercentHeader = document.createElement('div');
		mouseImageHeader.innerText = "____";
		mouseNameHeader.innerText = "Name";
		mouseFlatHeader.innerText = "Flat score";
		mousePercentHeader.innerText = "percentage score";
		mouseHeaders.appendChild(mouseImageHeader);
		mouseHeaders.appendChild(mouseNameHeader);
		mouseHeaders.appendChild(mouseFlatHeader);
		mouseHeaders.appendChild(mousePercentHeader);
		modal.appendChild(mouseHeaders);
		// Get the mouse stats.
		const mouseStats = await getMouseStats();

		// Loop through the stats and add them to the modal.
		calculateScore(mouseStats);
        for (const score in mouseScore){
			let result = buildScoreMarkup(score);
			result.addEventListener('click', () => {
				generateTypeDetails(score);
			});
			mouseBody.appendChild(result);

        }

		// Add the mouse stats to the modal.
		modal.appendChild(mouseBody);

		// Add the modal to the wrapper.
		modalWrapper.appendChild(modal);

		// Add the wrapper to the body.
		target.appendChild(modalWrapper);
	};
	const generateTypeDetails = async (score) => {
		// First, check to make sure we have the element we want to append to.
		const target = document.querySelector('.pageFrameView-content');
		if (! target) {
			return;
		}
		// Remove the existing modal.
		const existing = document.getElementById('cmt-type-details');
		if (existing) {
			existing.remove();
		}
		// Create the modal.
		const modalWrapper = document.createElement('div');
		modalWrapper.id = 'cmt-type-details';


		// Create the wrapper.
		const modal = document.createElement('div');
		modal.classList.add('cmt-type-details-wrapper');

		// Create the header.
		const header = document.createElement('div');
		header.classList.add('cmt-mice-stats-header');

		// Add the title;
		const title = document.createElement('h1');
		title.innerText = score + ' details';
		header.appendChild(title);

		// Create a close button icon.
		const closeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		closeIcon.classList.add('cmt-mice-stats-close');
		closeIcon.setAttribute('viewBox', '0 0 24 24');
		closeIcon.setAttribute('width', '18');
		closeIcon.setAttribute('height', '18');
		closeIcon.setAttribute('fill', 'none');
		closeIcon.setAttribute('stroke', 'currentColor');
		closeIcon.setAttribute('stroke-width', '1.5');

		// Create the path.
		const closePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		closePath.setAttribute('d', 'M18 6L6 18M6 6l12 12');
		closeIcon.appendChild(closePath);

		// Close the modal when the icon is clicked.
		closeIcon.addEventListener('click', () => {
			modalWrapper.remove();
		});

		// Append the button.
		header.appendChild(closeIcon);

		// Add the header to the modal.
		modal.appendChild(header);

		const mouseBody = document.createElement('div');
		mouseBody.classList.add('cmt-type-details-body');

		for (let mouse in mouseTypeList[score]){
			const mouseEl = document.createElement('a');
			mouseEl.classList.add('cmt-mice-stats');

			//Create the image element
			const image = document.createElement('div');
			image.classList.add('cmt-mice-stats-image');
			image.style.backgroundImage = `url('${ mouseTypeList[score][mouse].thumb }')`;

			// Create the name element.
			const name = document.createElement('div');
			name.classList.add('cmt-mice-stats-name');
			name.innerText = mouseTypeList[score][mouse].name;

			// Create a wrapper for the name and image.
			const imageNameContainer = document.createElement('div');
			imageNameContainer.appendChild(image);
			imageNameContainer.appendChild(name);

			// Create the catches element.
			const catches = document.createElement('div');
			catches.classList.add('cmt-mice-stats-catches');
			catches.innerText = mouseTypeList[score][mouse].num_catches;

			// Add the image and name to the mouse element.
			mouseEl.appendChild(imageNameContainer);
			mouseEl.appendChild(catches);
			mouseBody.appendChild(mouseEl)

		}
		modal.appendChild(mouseBody);

		// Add the modal to the wrapper.
		modalWrapper.appendChild(modal);
		// TODO: add it somewhere properly 
		// Add the wrapper to the body.
		target.appendChild(modalWrapper);

		console.log(mouseTypeList[score]);
	}

    addStyles(`#cmt-mice-stats, #cmt-type-details {
        position: absolute;
        top: 10px;
        left: -275px;
    }

    .cmt-mice-stats-wrapper, .cmt-type-details-wrapper {
		z-index: 5000;
        position: fixed;
        width: 450px;
        background: #f6f3eb;
        border: 1px solid #534022;
        box-shadow: 1px 1px 1px 0px #9d917f;
    }

    .cmt-mice-stats-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ceb7a6;
        background-color: #926944;
        padding: 10px;
        color: #f6f3eb;
    }

    .cmt-mice-stats-header h1 {
        color: #f6f3eb;
    }

    .cmt-mice-stats-close:hover {
        background-color: #ceb7a6;
        border-radius: 50%;
        cursor: pointer;
    }

    .cmt-mice-stats-body {
        max-height: 90vh;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .cmt-mice-stats-wrapper .cmt-mice-stats:nth-child(odd) {
        background-color: #e8e3d7;
    }

    .cmt-mice-stats, .cmt-type-details {
        display: flex;
        justify-content: space-between;
        padding: 2px 0;
        align-items: center;
        padding: 10px 10px;
        color: #000;
    }

    .cmt-mice-stats:hover, .cmt-type-details:hover,
    .cmt-mice-stats-wrapper .cmt-mice-stats:nth-child(odd):hover {
        outline: 1px solid #ccc;
        background-color: #eee;
        text-decoration: none;
    }

    .cmt-mice-stats-image {
        position: relative;
        width: 40px;
        height: 40px;
        display: inline-block;
        vertical-align: middle;
        background-size: contain;
        background-repeat: no-repeat;
        border-radius: 2px;
        box-shadow: 1px 1px 1px #999;
    }

    .cmt-mice-stats-crown {
        position: absolute;
        right: -5px;
        bottom: -5px;
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-color: #fff;
        border: 1px solid #333;
        background-size: 80%;
        border-radius: 50%;
    }

    .cmt-mice-stats-name {
        display: inline-block;
        vertical-align: middle;
        padding-left: 10px;
    }

    .cmt-mice-stats-catches {
        padding-right: 5px;
    }`);

    addSubmenuItem({
        menu: 'mice',
        label: 'Mouse Catch Stats',
        icon: 'https://www.mousehuntgame.com/images/ui/hud/menu/prize_shoppe.png',
        callback: showModal
    });
})());
