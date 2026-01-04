// ==UserScript==
// @name     Don anal filter
// @version  1
// @grant    none
// @include https://ibubara.mydns.jp/don-anal/don-anal.cgi?*
// @namespace https://greasyfork.org/users/1019345
// @description a
// @downloadURL https://update.greasyfork.org/scripts/459175/Don%20anal%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/459175/Don%20anal%20filter.meta.js
// ==/UserScript==

// create a form for filtering
let form = document.createElement('from');

let starFilterLabel = document.createElement('label');
starFilterLabel.innerText = 'Star : ';
let starFilter = document.createElement('select');
starFilter.setAttribute("id", "starFilter");
const noOfStars = 10;
// include 0 as 'any'
for (let i = 0; i <= noOfStars; i++) {
	let option = document.createElement('option');
	option.value = i;
	if (i === 0) {
		option.text = 'any';
	}
	else {
		option.text = i;
	}
	starFilter.appendChild(option);
};
// add listener to the select element
starFilter.addEventListener("change", function () {
	filter();
});

let genreFilterLabel = document.createElement('label');
genreFilterLabel.innerText = 'Genre : ';
let genreFilter = document.createElement('select');
genreFilter.setAttribute('id', "genreFilter");

const genres = new Map([['any', 0], ['namco', 'ナ'], ['jpop', 'ポ'], ['game', 'ゲ'], ['classic', 'ク'], ['kids', 'キ'], ['vocaloid', 'ボ'], ['anime', 'ア'], ['green', 'バ']]);
for (let [key, value] of genres) {
	let option = document.createElement('option');
	option.value = value;
	option.text = key;
	genreFilter.appendChild(option);
}

// add listener to the select element
genreFilter.addEventListener("change", function () {
	filter();
});

form.appendChild(starFilterLabel);
form.appendChild(document.createElement('br'));
form.appendChild(starFilter);
form.appendChild(document.createElement('br'));
form.appendChild(genreFilterLabel);
form.appendChild(document.createElement('br'));
form.appendChild(genreFilter);

let scoreTable = document.getElementsByTagName("table")[5];
let startingIndex = getStartingIndex();

let headerRow = scoreTable.getElementsByTagName('tr')[startingIndex - 1].getElementsByTagName('td');
for (let i = 0; i < headerRow.length; i++) {
	headerRow[i].addEventListener('click', function () {
		sort(i);
	})
}

scoreTable.prepend(form)

function filter() {
	// TODO : find a better way to get the score table
	let rows = scoreTable.getElementsByTagName("tr");
	let selectedStart = getSelectedStar();
	let selectedGenre = getSelectedGenre();

	// the first 2 rows are header info
	for (i = startingIndex; i < rows.length; i++) {
		// extract every columns for readbility
		let currentRow = rows[i].getElementsByTagName('td');
		let songName = currentRow[0].innerText;
		let difficulty = currentRow[1].innerText;
		let star = parseInt(currentRow[2].innerText);
		let lowestBpm = currentRow[3].innerText;
		let genreAndPos = currentRow[4].innerText;
		// an empty columns in index 5
		let crown = currentRow[6].innerText;
		let scoreRank = currentRow[7].innerText;
		let score = currentRow[8].innerText;
		let goods = currentRow[9].innerText;
		let oks = currentRow[10].innerText;
		let bads = currentRow[11].innerText;
		let combo = currentRow[12].innerText;
		let linda = currentRow[13].innerText;
		let rank = currentRow[14].innerText;

		let shouldHide = false;

		if (selectedStart != 0) {
			if (star != selectedStart) {
				shouldHide = true;
			}
		}

		if (selectedGenre != 0) {
			if (genreAndPos.charAt(0) != selectedGenre) {
				shouldHide = true;
			}
		}

		if (shouldHide) {
			rows[i].style.display = "none";
		} else {
			rows[i].style.display = "";
		}
	}
}

function getStartingIndex() {
	// if the first row has less than 14 columns, it is not a part of the score table
	return scoreTable.getElementsByTagName("tr")[0].getElementsByTagName("td").length < 14 ? 2 : 1;
}

function getSelectedStar() {
	let starFilter = document.getElementById("starFilter");
	return starFilter.value;
}

function getSelectedGenre() {
	let genreFilter = document.getElementById("genreFilter");
	return genreFilter.value;
}

function sort(index) {
	let tableBody = scoreTable.getElementsByTagName('tbody')[0];
	let rows = tableBody.getElementsByTagName('tr');

	let newRows = Array.from(rows);

	// no need to sort the header
	newRows.splice(0, startingIndex);

	newRows.sort(function (rowA, rowB) {
		let valueA = rowA.getElementsByTagName('td')[index].innerText;
		let valueB = rowB.getElementsByTagName('td')[index].innerText;

		if (!isNaN(valueA)) {
			valueA = parseInt(valueA);
			valueB = parseInt(valueB);
		}
		if (valueA < valueB) {
			return 1;
		}
		else if (valueA > valueB) {
			return -1;
		} else {
			return 0;
		}
	});

	const rowLength = rows.length;

	for (let i = startingIndex; i < rowLength; i++) {
		tableBody.removeChild(rows[startingIndex]);
	}

	for (let i = 0; i < newRows.length; i++) {
		tableBody.appendChild(newRows[i]);
	}

}