// ==UserScript==
// @name       PokeClicker Hacks
// @author     fiammanda
// @version    1.20220222
// @grant      none
// @match      https://www.pokeclicker.com/
// @license    MIT
// @description tab hack menu shiny rate and more...
// @namespace https://greasyfork.org/users/1055144
// @downloadURL https://update.greasyfork.org/scripts/463463/PokeClicker%20Hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/463463/PokeClicker%20Hacks.meta.js
// ==/UserScript==

let click = 0, hatch = 0;
const hacks = [
	[0, "catch rate", 10],
	["shiny", "shiny chance", 100],
	["roaming", "roaming chance", 10],
	["exp", "experience", 10],
	["eggStep", "egg step", 10],
	["money", "money", 9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999],
	["dungeonToken", "dungeon token", 500000],
	["clickAttack", "player attack", 9000000000],
	["pokemonAttack", "pokemon attack", 100],
	[4, "berry growth", 100],
	[8, "berry mutation", 100],
	[9, "berry replant", 100],
	[7, "mine enery", 900000],
	[10, "mine damage", 900000],
	[11, "mine award", 900000]
]

const style = document.createElement("style");
style.innerHTML = `
	#game {
		max-width: 1500px;
	}
	#game .col-lg-3 {
		flex: 0 0 20%;
		max-width: 20%;
	}
	#game .col-lg-6 {
		flex: 0 0 40%;
		max-width: 40%;
	}
	#hack {
		font-size: .825rem;
		overflow: auto;
	}
	#hack img, #hack svg {
		width: 1rem;
		color: #222;
	}
	#hack table {
		table-layout:fixed;
	}
	#hack td {
		padding: .25rem 0;
	}
	#hack td.disabled {
		background: rgba(0,0,0,.03);
		pointer-events: none;
	}
	#hack td.disabled img, #hack td.disabled svg {
		opacity: .25;
	}
	#hack td:first-child {
		padding: .25rem;
		text-align: left;
	}
	#hack td[data-rate]::before {
		content: attr(data-rate) attr(data-multiplier);
		font-size: .75rem;
		white-space: nowrap;
	}
	#hack td[data-rate="0"]::before {
		content: "-";
	}
	#hack td[onclick] {
		width: 2rem;
		background: rgba(0,0,0,.05);
		transition: background .2s ease-in-out;
		cursor: pointer;
	}
	#hack td[onclick]:hover {
		background: rgba(0,0,0,.08);
	}
`;
document.body.append(style);

const hack = document.createElement("div");
hack.className = "col-lg-2 order-lg-first";
let html = `<div class="card border-secondary mb-3">
	<div class="card-header p-0" data-toggle="collapse" href="#hack" aria-expanded="true"><span>Hacks</span></div>
	<div id="hack" class="card-body show p-0">
		<table class="table table-bordered m-0">
			<tr>
				<td>catch time</td>
				<td onclick="this.classList.add('disabled');App.game.pokeballs.pokeballs[0].catchTime = 100"><img src="assets/images/pokeball/Pokeball.svg"></td>
				<td onclick="this.classList.add('disabled');App.game.pokeballs.pokeballs[1].catchTime = 100"><img src="assets/images/pokeball/Greatball.svg"></td>
				<td onclick="this.classList.add('disabled');App.game.pokeballs.pokeballs[2].catchTime = 100"><img src="assets/images/pokeball/Ultraball.svg"></td>
				<td onclick="this.classList.add('disabled');App.game.pokeballs.pokeballs[3].catchTime = 100"><img src="assets/images/pokeball/Masterball.svg"></td>
			</tr>
`;
hacks.forEach((h, i) => {
	html += `<tr><td colspan="2">${h[1]}</td><td data-multiplier="${h[2].toString().substring(1)}" data-rate="0"></td><td onclick="`;
	html += `let r = Number(this.previousSibling.dataset.rate) + 1;`;
	html += `this.previousSibling.dataset.rate = r;`;
	html += `this.nextSibling.classList.remove('disabled');`;
	if (i == 0 || i > 8) {
		html += `r = r * ${h[2]};`;
		html += `App.game.oakItems.itemList[${h[0]}].bonusList = [r,r,r,r,r,r];`;
		html += `App.game.oakItems.itemList[${h[0]}].inactiveBonus = r;`;
	} else {
		html += `r = r * ${h[2]} / Math.max((r - 1) * ${h[2]}, 1);`;
		html += `App.game.multiplier.addBonus('${h[0]}', () => r);`;
	}
	html += `"><svg fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 5.75V18.25"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.25 12L5.75 12"/></svg></td><td class="disabled" onclick="`;
	if (i == 0 || i > 8) {
		html += `App.game.oakItems.itemList[${h[0]}].bonusList = [10,10,10,10,10,10];`;
		html += `App.game.oakItems.itemList[${h[0]}].inactiveBonus = 10;`;
	} else {
		html += `let r = Number(this.previousSibling.previousSibling.dataset.rate);`;
		html += `App.game.multiplier.addBonus('${h[0]}', () => 1 / Math.max(r * ${h[2]}, 1));`;
	}
	html += `this.previousSibling.previousSibling.dataset.rate = 0;`;
	html += `this.classList.add('disabled');`;
	html += `"><svg fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.25 4.75L8.75 7L11.25 9.25"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12.75 19.25L15.25 17L12.75 14.75"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 7H13.25C16.5637 7 19.25 9.68629 19.25 13V13.25"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.25 17H10.75C7.43629 17 4.75 14.3137 4.75 11V10.75"/></svg></td></tr>`;
});
html += `
			<tr>
				<td colspan="3">auto click</td>
				<td onclick="this.classList.add('disabled');this.nextElementSibling.classList.remove('disabled');click=setInterval(()=>{4==App.game.gameState&&DungeonRunner.handleClick()},100)"><svg fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.25 12L5.75 5.75V18.25L18.25 12Z"/></svg></td>
				<td class="disabled" onclick="this.classList.add('disabled');this.previousElementSibling.classList.remove('disabled');clearInterval(click)"><svg fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.25 6.75V17.25"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.75 6.75V17.25"/></svg></td>
			<tr>
			</tr>
				<td colspan="3">auto hatch</td>
				<td onclick="this.classList.add('disabled');this.nextElementSibling.classList.remove('disabled');hatch=setInterval(function(){for(let a=App.game.party.caughtPokemon.filter(a=>!(a.breeding||100>a.level)&&!(-1<BreedingController.filter.category()&&a.category!=BreedingController.filter.category())&&!(-1<BreedingController.filter.shinyStatus()&&+a.shiny!==BreedingController.filter.shinyStatus()));App.game.breeding.hasFreeQueueSlot()&&a.length;)App.game.breeding.addPokemonToHatchery(a[0]),a.shift()},6e4)"><svg fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.25 12L5.75 5.75V18.25L18.25 12Z"/></svg></td>
				<td class="disabled" onclick="this.classList.add('disabled');this.previousElementSibling.classList.remove('disabled');clearInterval(hatch)"><svg fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.25 6.75V17.25"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.75 6.75V17.25"/></svg></td>
			</tr>
		</table>
	</div>
</div>`;
html += `<div class="card sortable border-secondary mb-3" data-bind="visible: player.highestRegion">${document.getElementById("shortcutsContainer").innerHTML}</div>`;
hack.innerHTML = html;
document.getElementById("shortcutsContainer").remove();
document.querySelector(".justify-content-lg-center").prepend(hack);
