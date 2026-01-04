// ==UserScript==
// @name         🐭️ MouseHunt - Halloween Map Helper
// @version      1.1.4
// @description  Easily see and equip the cheese needed for Halloween Trick or Treat maps.
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://i.mouse.rip/mouse.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/452996/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Halloween%20Map%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/452996/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Halloween%20Map%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const cheeseIdToId = {
    super_brie_cheese: 1114,
    cauldron_tier_1_cheese: 3305,
    cauldron_tier_2_cheese: 3306,
    cauldron_tier_3_cheese: 3307,
    cauldron_tier_4_cheese: 3308,
  };

  const miceCheeses = [
    {
      name: 'Grey Recluse',
      cheese: 'Standard',
      cheeseId: 'super_brie_cheese'
    },
    {
      name: 'Cobweb',
      cheese: 'Standard',
      cheeseId: 'super_brie_cheese'
    },
    {
      name: 'Teenage Vampire',
      cheese: 'Standard',
      cheeseId: 'super_brie_cheese'
    },
    {
      name: 'Zombot Unipire',
      cheese: 'Standard',
      cheeseId: 'super_brie_cheese'
    },
    {
      name: 'Candy Cat',
      cheese: 'Standard',
      cheeseId: 'super_brie_cheese'
    },
    {
      name: 'Candy Goblin',
      cheese: 'Standard',
      cheeseId: 'super_brie_cheese'
    },
    {
      name: 'Shortcut',
      cheese: 'Standard',
      cheeseId: 'super_brie_cheese'
    },
    {
      name: 'Tricky Witch',
      cheese: 'Standard',
      cheeseId: 'super_brie_cheese'
    },
    {
      name: 'Sugar Rush',
      cheese: 'Standard',
      cheeseId: 'super_brie_cheese'
    },
    {
      name: 'Spirit Light',
      cheese: 'Monterey Jack-O-Lantern',
      cheeseId: 'cauldron_tier_1_cheese'
    },
    {
      name: 'Gourdborg',
      cheese: 'Monterey Jack-O-Lantern',
      cheeseId: 'cauldron_tier_1_cheese'
    },
    {
      name: 'Pumpkin Hoarder',
      cheese: 'Monterey Jack-O-Lantern',
      cheeseId: 'cauldron_tier_1_cheese'
    },
    {
      name: 'Trick',
      cheese: 'Monterey Jack-O-Lantern',
      cheeseId: 'cauldron_tier_1_cheese'
    },
    {
      name: 'Treat',
      cheese: 'Monterey Jack-O-Lantern',
      cheeseId: 'cauldron_tier_1_cheese'
    },
    {
      name: 'Wild Chainsaw',
      cheese: 'Monterey Jack-O-Lantern',
      cheeseId: 'cauldron_tier_1_cheese'
    },
    {
      name: 'Maize Harvester',
      cheese: 'Monterey Jack-O-Lantern',
      cheeseId: 'cauldron_tier_1_cheese'
    },
    {
      name: 'Creepy Marionette',
      cheese: 'Bonefort',
      cheeseId: 'cauldron_tier_2_cheese'
    },
    {
      name: 'Dire Lycan',
      cheese: 'Bonefort',
      cheeseId: 'cauldron_tier_2_cheese'
    },
    {
      name: 'Grave Robber',
      cheese: 'Bonefort',
      cheeseId: 'cauldron_tier_2_cheese'
    },
    {
      name: 'Hollowhead',
      cheese: 'Bonefort',
      cheeseId: 'cauldron_tier_2_cheese'
    },
    {
      name: 'Mousataur Priestess',
      cheese: 'Bonefort',
      cheeseId: 'cauldron_tier_2_cheese'
    },
    {
      name: 'Sandmouse',
      cheese: 'Bonefort',
      cheeseId: 'cauldron_tier_2_cheese'
    },
    {
      name: 'Titanic Brain-Taker',
      cheese: 'Bonefort',
      cheeseId: 'cauldron_tier_2_cheese'
    },
    {
      name: 'Tomb Exhumer',
      cheese: 'Bonefort',
      cheeseId: 'cauldron_tier_2_cheese'
    },
    {
      name: 'Admiral Arrrgh',
      cheese: 'Polter-Geitost',
      cheeseId: 'cauldron_tier_3_cheese'
    },
    {
      name: 'Captain Cannonball',
      cheese: 'Polter-Geitost',
      cheeseId: 'cauldron_tier_3_cheese'
    },
    {
      name: 'Ghost Pirate Queen',
      cheese: 'Polter-Geitost',
      cheeseId: 'cauldron_tier_3_cheese'
    },
    {
      name: 'Gourd Ghoul',
      cheese: 'Polter-Geitost',
      cheeseId: 'cauldron_tier_3_cheese'
    },
    {
      name: 'Scorned Pirate',
      cheese: 'Polter-Geitost',
      cheeseId: 'cauldron_tier_3_cheese'
    },
    {
      name: 'Spectral Butler',
      cheese: 'Polter-Geitost',
      cheeseId: 'cauldron_tier_3_cheese'
    },
    {
      name: 'Spectral Swashbuckler',
      cheese: 'Polter-Geitost',
      cheeseId: 'cauldron_tier_3_cheese'
    },
    {
      name: 'Baba Gaga',
      cheese: 'Scream',
      cheeseId: 'cauldron_tier_4_cheese'
    },
    {
      name: 'Bonbon Gummy Globlin',
      cheese: 'Scream',
      cheeseId: 'cauldron_tier_4_cheese'
    },
    {
      name: 'Hollowed',
      cheese: 'Scream',
      cheeseId: 'cauldron_tier_4_cheese'
    },
    {
      name: 'Hollowed Minion',
      cheese: 'Scream',
      cheeseId: 'cauldron_tier_4_cheese'
    },
    {
      name: 'Swamp Thang',
      cheese: 'Scream',
      cheeseId: 'cauldron_tier_4_cheese'
    }
  ];

  /**
   * Add styles to the page.
   *
   * @param {string} styles The styles to add.
   */
  const addStyles = (styles) => {
    const existingStyles = document.getElementById('mh-mouseplace-custom-styles');

    if (existingStyles) {
      existingStyles.innerHTML += styles;
    } else {
      const style = document.createElement('style');
      style.id = 'mh-mouseplace-custom-styles';

      style.innerHTML = styles;
      document.head.appendChild(style);
    }
  };

  /**
   * Do something when the overlay is shown or hidden.
   *
   * @param {Object}   callbacks
   * @param {Function} callbacks.show   The callback to call when the overlay is shown.
   * @param {Function} callbacks.hide   The callback to call when the overlay is hidden.
   * @param {Function} callbacks.change The callback to call when the overlay is changed.
   */
  const onOverlayChange = (callbacks) => {
    const observer = new MutationObserver(() => {
      if (callbacks.change) {
        callbacks.change();
      }

      if (document.getElementById('overlayBg').classList.length > 0) {
        if (callbacks.show) {
          callbacks.show();
        }
      } else if (callbacks.hide) {
        callbacks.hide();
      }
    });
    observer.observe(
      document.getElementById('overlayBg'),
      {
        attributes: true,
        attributeFilter: ['class']
      }
    );
  };

  /**
   * Add links to the mouse details on the map.
   */
  const addCheeseLinks = () => {
    const overlayClasses = document.getElementById('overlayPopup').classList;
    if (! overlayClasses.contains('treasureMapPopup')) {
      return;
    }

    const mapName = document.querySelector('.treasureMapView-mapMenu-rewardName');
    if (! mapName) {
      setTimeout(addCheeseLinks, 500);
      return;
    }

    if (! mapName.innerText) {
      return;
    }

    if (! mapName.innerText.includes('Halloween')) {
      return;
    }

    const mouseIcon = document.querySelectorAll('.treasureMapView-goals-group-goal');
    if (mouseIcon.length === 0) {
      setTimeout(addCheeseLinks, 500);
    }

    mouseIcon.forEach((mouse) => {
      const classes = mouse.classList;
      if (classes.contains('complete')) {
        return;
      }

      const mouseName = mouse.querySelector('.treasureMapView-goals-group-goal-name span');
      if (! (mouseName && mouseName.textContent)) {
        return;
      }

      const mouseContainer = mouse.querySelector('.treasureMapView-goals-group-goal-name');
      if (! mouseContainer) {
        return;
      }

      // grab the data outof the micecheese array
      const mouseData = miceCheeses.find((mouseCheese) => mouseCheese.name === mouseName.textContent);
      if (! mouseData) {
        return;
      }

      // add in a button and a background color
      const mouseButton = document.createElement('a');
      mouseButton.classList.add('mh-halloween-cheese-selector');

      const currentCheese = user.bait_item_id; // eslint-disable-line no-undef
      if (cheeseIdToId[ mouseData.cheeseId ] === currentCheese) {
        mouseButton.textContent = `${mouseData.cheese} equipped`;
      } else {
        mouseButton.textContent = `Equip ${mouseData.cheese}`;
      }

      const parent = mouseContainer.parentNode.parentNode;
      parent.classList.add('mh-halloween-cheese-' + mouseData.cheeseId);

      parent.addEventListener('click', () => {
        hg.utils.TrapControl.setBait(mouseData.cheeseId); // eslint-disable-line no-undef
        hg.utils.TrapControl.go(); // eslint-disable-line no-undef

        const close = document.getElementById('jsDialogClose');
        if (close) {
          close.click();
        }
      });

      mouseContainer.appendChild(mouseButton);
    });
  };

  addStyles(`.treasureMapView.event.halloween_treat_2021 .treasureMapView-goals-groups div:nth-child(2),
	.treasureMapView.event.halloween_trick_2021 .treasureMapView-goals-groups div:nth-child(2) {
		display: grid;
    	grid-template-columns: repeat(2, 1fr);
		padding: 1em;
	}

	.treasureMapView.event.halloween_treat_2021 .treasureMapView-highlight .treasureMapView-goals-groups div:nth-child(2),
	.treasureMapView.event.halloween_trick_2021 .treasureMapView-highlight .treasureMapView-goals-groups div:nth-child(2) {
		display: block;
	}

	.treasureMapView.event.halloween_treat_2021 .treasureMapView-block-content .treasureMapView-goals-group-goal,
	.treasureMapView.event.halloween_trick_2021 .treasureMapView-block-content .treasureMapView-goals-group-goal {
		width: 90%;
		cursor: initial;
	}

	.treasureMapView.event.halloween_treat_2021 .treasureMapView-goals-group-goal:hover:before,
	.treasureMapView.event.halloween_trick_2021 .treasureMapView-goals-group-goal:hover:before {
		background-color: transparent;
		left: 0;
		right: -2px;
	}

	.treasureMapView.event.halloween_treat_2021 .treasureMapView-block-content .treasureMapView-goals-group-goal-padding .treasureMapView-goals-group-goal-name,
	.treasureMapView.event.halloween_trick_2021 .treasureMapView-block-content .treasureMapView-goals-group-goal-padding .treasureMapView-goals-group-goal-name {
		display: flex;
		flex-direction: column;
	}

	.treasureMapView.event.halloween_treat_2021 .treasureMapView-goals-group-goal:hover:before,
	.treasureMapView.event.halloween_trick_2021 .treasureMapView-goals-group-goal:hover:before {
		box-shadow: 0 0 0 1px #646363;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}

	.mh-halloween-cheese-selector {
		margin-top: 0.5em;
	}

	.mh-halloween-cheese-cauldron_tier_1_cheese {
		background-color: #ffaa4c !important;
		border-radius: 5px;
	}

	.mh-halloween-cheese-cauldron_tier_2_cheese {
		background-color: #eac2d1 !important;
		border-radius: 5px;
	}

	.mh-halloween-cheese-cauldron_tier_3_cheese {
		background-color: #cfeaec !important;
		border-radius: 5px;
	}

	.mh-halloween-cheese-cauldron_tier_4_cheese {
		background-color: #b5d652 !important;
		border-radius: 5px;
	}`);

  onOverlayChange({ show: addCheeseLinks });
}());
