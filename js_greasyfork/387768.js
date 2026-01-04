// ==UserScript==
// @name     Kobo Detrashify
// @description Removes the really trashy novels from Kobo
// @version  1-20.1
// @grant    none
// @include https://kobo.com/*
// @include https://*.kobo.com/*
// @license MIT
// @namespace ptrharmonic.kobo
// @downloadURL https://update.greasyfork.org/scripts/387768/Kobo%20Detrashify.user.js
// @updateURL https://update.greasyfork.org/scripts/387768/Kobo%20Detrashify.meta.js
// ==/UserScript==

// Are we in edit mode?
let url = new URL(window.location);
let edit = url.searchParams.get('edit');
const EDIT_MODE = edit != null;
console.log(EDIT_MODE);

// Check and see if we should update our list
let myStorage = window.localStorage;

let authorSet = myStorage.getItem('KD-authors');
console.log(authorSet);
if (authorSet == null || true) {
  console.log('help');
  authorSet = [
    'Victoria Pinder',
		'Nina Levine',
    'Ramona Gray',
    'Dale Mayer',
    'Donna Grant',
    'Kendall Ryan',
    'Rebecca Zanetti',
    'Alyssa Drake',
    'Lori Foster',
    'Vella Day',
    'Elizabeth Kelly',
    'Meghan March',
    'Blair Babylon',
    'Tessa Layne',
    'Bethany Lopez',
    'Lynn Raye Harris',
    'Lane Lynn Vale',
    'Lani Lynn Vale',
    'S.E. Smith',
    'Carly Phillips',
    'Kylie Gilmore',
    'Manda Collins',
    'Katie Reus',
    'K.A. Linde',
   	'Cynthia Wright',
    'Vi Keeland',
    'Natasha Madison',
    'Adriana Anders',
    'Kelly Bowen',
    'Joanna Shupe',
    'Sophie Barnes',
    'Elizabeth Hoyt',
    'Maya Rodale',
    'Susan Stoker',
    'Nicole Morgan',
    'Geri Foster',
    'J.M. Madden',
    'E L James',
    'Marilyn Campbell',
    'Marliss Melton',
    'Alexa Riley',
    'Piper Rayne',
    'Lex Martin',
    'Lili Valente',
    'Lila Monroe',
    'Lauren Blakely',
    'Emma Hart',
    'Stacey Lynn',
    'Lexi Ryan',
    'Julia Kent',
    'Kennedy Fox',
    'Kate Meader',
    'Elise Faber',
    'Jana Aston',
    'Toni Aleo',
    'Sawyer Bennett',
    'Laurelin Page',
    'Cathryn Fox',
    'Autumn Jones Lake',
    'Chelle Bliss',
    'Erin Wright',
    'Elizabeth Lennox',
    'Luke Young',
    'Madison Faye',
    'Susan Hayes',
    'Kerrigan Byrne',
   	'Stephanie Julian',
    'Lynsay Sands',
    'Ann Mayburn',
    'Eve Langlais',
    'Anabelle Bryant',
    'Jasinda Wilder',
    'Marissa Farrar',
    'Allyson Jeleyne',
    'Natalie Wrye',
    'Laura Griffin',
    'Cora Seton',
    'Mandy M. Roth',
    'Maya Banks',
    'Alexis Abbott',
    'Jane Anthony',
    'Sybil Bartel',
    'Evangeline Anderson',
    'Tami Lund',
    'Cynthia Sax',
    'Nancey Cummings',
    'R.E. Butler',
    'Theresa Hissong',
    'Amelia Hutchins',
    'Grace Goodwin',
    'Mina Carter',
    'Michelle Howard',
    'Elia Winters',
    'Jayne Rylon',
    'Chelsea Camaron',
    'Caitlyn O\'Leary',
    'Lara Adrian',
    'Laurann Dohner',
    'Alyssa Cole',
    'N.J. Walters',
    'Christina Phillips',
    'Tessa Dare'
    ];
  myStorage.setItem('KD-authors', JSON.stringify(authorSet));
  authorSet = new Set(authorSet);
} else {
	authorSet = new Set(JSON.parse(authorSet));
}


function addAuthor() {
  console.log("asdf");
	console.log("add author!", this);
}



deletThis(document.querySelectorAll('.item-container'));
deletThis(document.querySelectorAll('.book'));
deleteCarouselImages(document.querySelectorAll(".book.minimal-item"));
//deleteCarouselImages(document.querySelectorAll(".carousel-items"));

function deletThis(books) {
  for (let i = 0; i<books.length; i++) {
    let author = books[i].querySelector('.contributor-name');
    if (author == null) {
      continue;
    }

    let authorName = JSON.parse(author.getAttribute('data-track-info'))['author'];
    // console.log(authorName);
    if (authorSet.has(authorName)) {
      console.log('UR A BITCH', authorName);
      books[i].remove();
    } else if (EDIT_MODE) {
      console.log("asdf");
      let element = document.createElement('button');
      element.setAttribute('onClick', addAuthor);
      element.setAttribute('value', 'Add author (value)');
      element.textContent = "Add author";
      author.insertAdjacentElement('afterend', element);
    }
  }
}

function deleteCarouselImages(images) {
  images.forEach((image) => {
    let div = image.querySelector("div.notranslate_title");
    let fullTitle = div.getAttribute('title');
    let authorName = fullTitle.substring(fullTitle.lastIndexOf('by') + 3);
    if (authorSet.has(authorName)) {
      console.log('UR A BITCH', authorName);
    	image.parentNode.remove();
    }
  });
}




