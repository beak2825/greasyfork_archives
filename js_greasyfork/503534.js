// ==UserScript==
// @name         AO3 Length Comparator
// @namespace    http://tampermonkey.net/
// @version      2024-1-25
// @description  Categorize works by length as though they were published books. Additionally, compare long works to original texts of similar length.
// @author       threeqc
// @license      GNU GPLv3
// @match        *://archiveofourown.org/*
// @match        *://www.archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503534/AO3%20Length%20Comparator.user.js
// @updateURL https://update.greasyfork.org/scripts/503534/AO3%20Length%20Comparator.meta.js
// ==/UserScript==

// Settings
// =========
const show_category           = true;
const show_comparison         = true;
const category_upper_cutoff   = false;   // Set to false to disable upper bound (default: false)
                                         // Set to one less than comparison_lower_cutoff to show only the category or the comparison

const comparison_lower_cutoff = 150000;  // Set to false to disable lower bound (default: 150000)
const comparison_upper_cutoff = false;   // Set to false to disable upper bound (default: false)

                                         // Detecting drabble collections beyond a point is kind of a nightmare, it turns out. I'll probably end up changing the logic to just check for tags.
const check_for_drabbles      = true;    // Set to false to never categorize works as drabbles. (default: true)
const drabble_upper_cutoff    = 500;     // Set to false to allow drabble collections of arbitrary length. (default: 500)
const require_100_per_chapter = false;   // Set to a number to require drabbles to be 100 words per chapter beyond that word count. (default: false)
const require_exact_match     = true;    // Set to true to require the word count to be an exact multiple of 100. The number is how far it can be from a perfect drabble. (default: true)
// =========

// TODO:
//    1. List all sources
//    2. Be more selective about sourcing
//    3. Fill gaps
//    4. Clean up
//    5. Establish a set of tests

// Probably don't use this list as a source for exact counts.
const examples = {
    "5800": "The Yellow Wallpaper",
    "6535": "A Modest Proposal", //anycount.com
    // gap
    "7775": "The Monkey's Paw",
    // gap
    "17121": "The Little Prince", //anycount.com
    // gap
    "19965": "Common Sense",
    // gap
    "25189": "Metamorphosis", //anycount.com
    // gap
    "27000": "The Old Man and the Sea", //nytimes.com
    "28668": "Dr. Jekyll and Mr. Hyde", //anycount.com
    "29610": "Alice in Wonderland", //anycount.com
    "29966": "Animal Farm", //huffpost.com (publisher's weekly)
    "30644": "Charlie and the Chocolate Factory", //commonplacebook.com
    "31650": "A Christmas Carol", //anycount.com
    // gap
    "35530": "The Time Machine", //anycount.com
    "38000": "The Lion, The Witch, and The Wardrobe",
    // gap
    "42636": "The Wonderful Wizard of Oz", //anycount.com
    "43092": "Beowulf", //anycount.coms
    "46118": "Fahrenheit 451",
    "46333": "The Hitchhiker's Guide to the Galaxy", //barnesandnoble.com
    "47015": "A Study in Scarlet", //anycount.com
    "47094": "The Great Gatsby", //barnesandnoble.com
    "49962": "Fight Club", //barnesandnoble.com
    "50844": "Peter Pan", //anycount.com
    "52587": "A Wrinkle in Time", //wordcounters.com
    "53510": "We Have Always Lived in the Castle", //huffpost.com (publisher's weekly)
    "55000": "Annihilation [est.]",
    "59900": "Lord of the Flies",
    "60175": "The Color of Magic",
    "63194": "The War of the Worlds", //anycount.com
    "63766": "Brave New World",
    "65752": "The Fault in Our Stars", //wordcounters.com
    "66556": "The Color Purple", //commonplacebook.com
    "66950": "Treasure Island",
    "67707": "The Sun Also Rises",
    "70544": "The Catcher in the Rye", //wordcounters.com
    "72036": "Treasure Island", //anycount.com
    "72790": "The Other Wind", //reddit.com
    "78100": "Frankenstein", //anycount.com, wordcounter.tools
    "82222": "The Picture of Dorian Gray", //anycount.com
    "83705": "The Secret Garden", //anycount.com
    "84855": "Gilead", //commonplacebook.com
    "86100": "Piranesi", //thefantasyinn.com
    "86897": "The Scarlet Letter", //wordcounter.tools
    "88942": "Nineteen Eighty-Four",
    "89426": "The Princess Bride", //wordcounters.com *
    "95022": "The Hobbit", //commonplacebook.com
    "97364": "Anne of Green Gables",
    "99750": "The Hunger Games", //wordcounters.com *
    "100388": "To Kill A Mockingbird",
    "100609": "Ender's Game",
    "104288": "Grimm's Fairy Tails", //anycount.com
    "107293": "Gulliver's Travels", //anycount.com
    "107605": "The Adventures of Sherlock Holmes", //anycount.com
    "107945": "Wuthering Heights",
    "109185": "Good Omens",
    "109571": "The Adventures of Huckleberry Finn",
    "119394": "Sense and Sensibility",
    "124713": "Pride and Prejudice", //anycount.com
    "129443": "The Odyssey",
    "134710": "Schindler's List",
    "135420": "A Tale of Two Cities", //arbookfind.com
    "138138": "20000 Leagues Under the Sea", //arbookfind.com
    "144330": "The Da Vinci Code", //anycount.com
    "144523": "One Hundred Years of Solitude.", //arbookfind.com
    "145092": "A Tree Grows in Brooklyn", //commonplacebook.com
    "145469": "The Last of the Mohicans",
    "147317": "The Iliad",
    "155887": "Emma", //commonplacebook.com
    "156154": "Watership Down",
    "165453": "Dracula", //anycount.com
    "169481": "The Grapes of Wrath",
    "171479": "Oliver Twist", //fcit.usf.edu/project/cd/
    "174296": "Catch-22", //commonplacebook.com
    "187240": "Dune",
    "188623": "American Gods",
    "199016": "Great Expectations", //fcit.usf.edu/project/cd/
    "200000": "House of Leaves", // counts differ on this one. this is my estimate, made by taking the PDF and extracting the text, then doing my best to clean up the results, and then rounding down (by like 100) for good measure.
    "206052": "Moby Dick",
    "211591": "Crime and Punishment",
    "220117": "The Republic", //anycount.com
    "225395": "East of Eden", //commonplacebook.com
    "234100": "Last Argument of Kings", //reddit.com
    "249110": "The Hitchhiker's 'Trilogy'", //reddit.com the trilogy of all five books.
    "257154": "The Goblet of Fire",
    "265000": "Ulysses",
    "292727": "A Game of Thrones",
    "301583": "Hunger Games Trilogy",
    "329150": "The Earthsea Cycle",
    "344000": "Chronicles of Narnia",
    "354098": "The Brothers Karamazov", //anycount.com
    "360241": "David Copperfield", //anycount.com
    "386470": "The Way of Kings", //reddit.com
    "413202": "A Dance With Dragons", //reddit.com
    "418453": "Gone With the Wind",
    "421080": "Percy Jackson Series",
    "430269": "Don Quixote", //anycount.com
    "439736": "Anna Karenina",
    "464162": "The Count of Monte Cristo",
    "483994": "Infinite Jest",
    "530982": "Les Miserables",
    "561996": "Atlas Shrugged",
    "563675": "To Green Angel Tower",
    "587246": "Twilight Series",
    "587287": "War and Peace",
    "591544": "A Suitable Boy", //commonplacebook.com
    // gap
    "706574": "LoTR [w/ Silmarillion]",
    // gap
    "790678": "Bible [KJV]",
    "838240": "Dune Series",
    "874557": "Homestuck [text]", // adjusted estimates are all over the place
    "925100": "Witcher Series", //thefantasyinn.com
    "970000": "Clarissa",
    // gap
    "1084625": "Harry Potter Series",
    "1100000": "Sironia, Texas",
    "1154971": "Umineko", // https://www.reddit.com/r/umineko/comments/ccvs6n/another_estimate_of_uminekos_word_count/
    "1267010": "The Dark Tower Series", //thefantasyinn.com almost the exact same length
    "1267069": "In Search of Lost Time", //the longest commonly-distributed single book
    "1300000": "Zettel's Traum",
    // gap
    "1493000": "The Expanse",
    // gap
    "1736054": "A Song of Ice and Fire [1-5]",
    "1800000": "Mahabharata [est.]",
    "1901905": "The First Law", //thefantasyinn.com
    "2000000": "Baldur's Gate 3 [est.]", // you'd think guiness could get the precise number
    "2060240": "A Song of Ice and Fire [all]",
    "2231000": "Redwall Series", //thefantasyinn.com
    "2400000": "A Chronicle of Ancient Sunlight",
    "2473678": "Dresden Files Series", //thefantasyinn.com
    // Ginnungagap
    "3327215": "Discworld Series",
    "3381980": "Malazan Book of the Fallen Series", //thefantasyinn.com some of these titles are a bit unweildy
    "3607401": "Parahumans", //thefantasyinn.com
    "3786250": "In the Realms of the Unreal", //the uncontested longest published single book by one author, even if you want to count Ancient Sunlight as one book. this list is excluding stuff like The Blah Story or Marienbad My Love, which are not really stories at all.
    "3885275": "Realm of the Elderlings Series", //thefantasyinn.com
    "3991843": "Pact & Pale", // /thefantasyinn.com Pale, the second work of this arguable two-part series, was unfinished when the source was written. This is the same author (J. C. McCrae) as Parahumans, making him probably the third most prolific author in history after Pirateaba, who writes The Wandering Inn, and Jamesdean5842, who wrote The Loud House: Revamped.
    "4108915": "Riftwar Series",
    "4287886": "Wheel of Time Series",
    // gap
    "5147450": "The Sword of Truth", //thefantasyinn.com
    // "11970740": "The Wandering Inn", //thewanderinginn.neocities.org september 2023
    "13500000": "The Wandering Inn [est.]", // Naively assuming the writing has been done at a constant pace since its inception. This does include the original version of Volume 1.
    "44000000": "Encyclopedia Britannica [print]",
    // The Daoist scripture, the Daozang, might be longer, but no word count exists to my knowledge and the Encyclopedia Britannica is already longer than any fictional work.
};

const factors = n => {
  let a = [],
    f = 2;
  while (n > 1) {
    if (n % f === 0) {
      a.push(f);
      n /= f;
    } else {
      f++;
    }
  }
  return a;
};

function checkLength (length, chapter_count) {
    length = length.replaceAll(',', '');
    let examplesarr = Object.keys(examples);
    const closest = examples[examplesarr.reduce((a, b) => {
        return Math.abs(b - length) < Math.abs(a - length) ? b : a;
    })];

    let drabble_types = ["", "Double ", "Triple ", "Quadruple ", "Quintuple ", "Sextuple ", "Septuple ", "Octuple ", "Nonuple ", "Decuple ", "Undecuple ", "Duodecuple ", "Tredecuple "];
    let drabble_primes = ["Double ", "Triple ", "Quintuple ", "Septuple ", "Undecuple ", "Tredecuple ", "Septendecuple ", "Novemdecuple ", "Tresvigintuple ", "Novemvigintuple ", "Untrigintuple ", "Septentrigintuple ", "Unquadragintuple ", "Tresquadragintuple ", "Septenquadragintuple ", "Tresquinquagintuple ", "Novenquinquagintuple ", "Unsexagintuple ", "Septensexgintuple ", "Unseptuagintuple ", "Treseptuagintuple ", "Novenseptuagintuple ", "Tresoctogintuple ", "Novemoctogintuple ", "Septenonagintuple "];
    let primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

    let designation = "";

    if (show_category & (!category_upper_cutoff | category_upper_cutoff >= length)) {
        if (length == 0) {
            designation = "Images"
        } else if (check_for_drabbles & ((length <= drabble_upper_cutoff) | !drabble_upper_cutoff) & ((chapter_count == Math.round(length / 100)) | !require_100_per_chapter | require_100_per_chapter > length) & (((length % 100) <= require_exact_match) | ((length % 100) >= 100 - require_exact_match))) {
            let multiple = Math.round(length / 100);

            if (multiple <= 13) {
                designation = drabble_types[multiple - 1] + "Drabble";
            } else {
                let factorized = true;
                let factor_list = factors(multiple);

                for (let factor of factor_list) {
                    if (primes.includes(factor)) {
                        designation += drabble_primes[primes.indexOf(factor)];
                    } else {
                        designation = "Drabble Collection";
                        factorized = false;
                        break;
                    }
                }
                if (factorized) {designation += "Drabble"};
            }
        } else if (length <= 500) {
            designation = "Microfiction";
        } else if (length <= 1500) {
            designation = "Flash Fiction";
        } else if (length <= 7500) {
            designation = "Short Story";
        } else if (length <= 17500) {
            designation = "Novelette";
        } else if (length <= 40000) {
            designation = "Novella";
        } else if (length <= 60000) {
            designation = "Short Novel";
        } else if (length <= 110000) {
            designation = "Novel";
        } else {
            designation = "Series: " + Math.max(Math.round(length/85000), 2) + "x Volumes" // different sources claim average novel length is 90000 or 80000. playing it safe.
        }
    }

    if (show_comparison & (!comparison_upper_cutoff | comparison_upper_cutoff >= length) & (!comparison_lower_cutoff | length >= comparison_lower_cutoff)) {
        designation += ((!category_upper_cutoff | category_upper_cutoff >= length) ? ", ": "") + closest;
    }

    return designation;
}

(function() {
    const wces = Array.from(document.querySelectorAll('dd.words')); // get word counts
    var chas = [];
    if (check_for_drabbles) {chas = Array.from(document.querySelectorAll('dd.chapters'));} // get chapter counts

    // pad the chapters list in case the word count is on a series or statistics page, in which case there will be one fewer or no chapter counts.
    let iters = 0;
    while ((chas.length != wces.length) & iters < 50) {
        chas.unshift(false);
        iters++;
    }

    for (const [index, wc] of wces.entries()) {
        let chapter_data;
        if (chas[index].nodeName == "a") {
            chapter_data = chas[index].firstChild.innerText; // if there are multiple chapters
        } else {
            chapter_data = 1; // should only happen if there's only one chapter or if the element is padding
        }
        wc.innerText = wc.innerText + " (" + checkLength(wc.innerText, chapter_data) + ")";
    };

    // code for finding gaps in the list
    // let oldLength = 0;
    // for (const [key, value] of Object.entries(examples)) {
    //     console.log(`${Math.round((key - oldLength) / key * 100)}%`, `${oldLength} - ${key}`, value);
    //     oldLength = key;
    // }
})();