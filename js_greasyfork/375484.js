// ==UserScript==
// @name         MouseHunt - GWH Golem Names
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      1.5
// @description  Adds fun and quirky names to your Snow Golems!
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/375484/MouseHunt%20-%20GWH%20Golem%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/375484/MouseHunt%20-%20GWH%20Golem%20Names.meta.js
// ==/UserScript==

(function () {
  const adj = [
    "N/A",
    "Accountant",
    "Adept",
    "Admired",
    "Aggressive",
    "Agreeable",
    "Amiable",
    "Angelic",
    "Aroused",
    "Athletic",
    "Awesome",
    "Balding",
    "Basic",
    "Beautiful",
    "Boastful",
    "Brazen",
    "Buff",
    "Burly",
    "Carefree",
    "Casual",
    "Cheeky",
    "Chivalrous",
    "Clumsy",
    "Confident",
    "Crazy",
    "Cute",
    "Dapper",
    "Dashing",
    "Dazzling",
    "Detective",
    "Downbeat",
    "Emotional",
    "Envious",
    "Excited",
    "Exotic",
    "Extraordinary",
    "Faithful",
    "Famous",
    "Fancy",
    "Feisty",
    "Fierce",
    "Filthy",
    "Flabby",
    "Flexible",
    "Foolish",
    "Frugal",
    "Funny",
    "Gentle",
    "Glorious",
    "Greedy",
    "Gullible",
    "Hacker",
    "Handsome",
    "Healthy",
    "Homesick",
    "Horrible",
    "Humble",
    "Hungry",
    "Impulsive",
    "Insane",
    "Interesting",
    "Intrepid",
    "Intuitive",
    "Irritable",
    "Jaded",
    "Jealous",
    "Jolly",
    "Joyful",
    "Kind",
    "Lanky",
    "Laughing",
    "Lazy",
    "Loud",
    "Lovely",
    "Loyal",
    "Lusty",
    "Luxurious",
    "Majestic",
    "Maniac",
    "Master",
    "Mighty",
    "Misguided",
    "Morbid",
    "Muscular",
    "Mysterious",
    "Mystic",
    "Natural",
    "Nervous",
    "Oddball",
    "One-Eyed",
    "Outlaw",
    "Patriot",
    "Pensive",
    "Perceptive",
    "Perky",
    "Philosophical",
    "Plumber",
    "Plump",
    "Posh",
    "Presidential",
    "Primal",
    "Professional",
    "Quixotic",
    "Raunchy",
    "Regal",
    "Reliable",
    "Remarkable",
    "Respectful",
    "Ridiculous",
    "Risque",
    "Rowdy",
    "Skeptical",
    "Scheming",
    "Scoundrel",
    "Scruffy",
    "Secretary",
    "Sentient",
    "Shady",
    "Shameless",
    "Shiny",
    "Simple",
    "Singing",
    "Skinny",
    "Sleepy",
    "Slender",
    "Smelly",
    "Speedy",
    "Spineless",
    "Stinky",
    "Stubborn",
    "Suave",
    "Succesful",
    "Sweaty",
    "Thick",
    "Timid",
    "Tough",
    "Traditional",
    "Traveler",
    "Trusty",
    "Uncomfortable",
    "Unpleasant",
    "Ultimate",
    "Valiant",
    "Vengeful",
    "Veritable",
    "Voluptuous",
    "Vulgar",
    "Warlord",
    "Weak",
    "Whimsical",
    "Whirlwind",
    "Wild",
    "Wistful",
    "Witty",
    "Worldly",
    "Young",
    "Zesty"
  ];

  const name = [
    "N/A",
    "Aaron",
    "Abigail",
    "Adam",
    "Alan",
    "Alex",
    "Alexa",
    "Allison",
    "Amanda",
    "Amber",
    "Amelia",
    "Amy",
    "Anna",
    "Andy",
    "Ashley",
    "Audrey",
    "Ben",
    "Beth",
    "Brandon",
    "Brian",
    "Brittany",
    "Brooke",
    "Caitlin",
    "Caleb",
    "Carlos",
    "Carmen",
    "Caroline",
    "Cassandra",
    "Catherine",
    "Chad",
    "Charles",
    "Charlotte",
    "Chloe",
    "Chris",
    "Cindy",
    "Claire",
    "Cody",
    "Cynthia",
    "Daisy",
    "Dana",
    "Daniel",
    "David",
    "Dennis",
    "Derek",
    "Diana",
    "Diego",
    "Dylan",
    "Edgar",
    "Edward",
    "Elizabeth",
    "Emily",
    "Emma",
    "Eric",
    "Evan",
    "Evelyn",
    "Frank",
    "Gary",
    "George",
    "Grace",
    "Greg",
    "Hannah",
    "Harold",
    "Heather",
    "Henry",
    "Ian",
    "Isaac",
    "Isabel",
    "Jack",
    "Jacob",
    "James",
    "Jared",
    "Jasmine",
    "Jason",
    "Jeffrey",
    "Jenny",
    "Jerry",
    "Jesse",
    "Jessica",
    "Jesus",
    "Jill",
    "John",
    "Jordan",
    "Joe",
    "Jose",
    "Juan",
    "Julia",
    "Justin",
    "Karen",
    "Kate",
    "Keith",
    "Kelly",
    "Kevin",
    "Kim",
    "Kyle",
    "Laura",
    "Lauren",
    "Leah",
    "Leslie",
    "Levi",
    "Lily",
    "Lindsey",
    "Logan",
    "Lois",
    "Lucas",
    "Lucy",
    "Madeline",
    "Marcus",
    "Margaret",
    "Maria",
    "Mark",
    "Martin",
    "Mary",
    "Megan",
    "Mia",
    "Michael",
    "Michelle",
    "Molly",
    "Natalie",
    "Nathan",
    "Nick",
    "Nicole",
    "Oliver",
    "Olivia",
    "Patrick",
    "Paul",
    "Peter",
    "Rachel",
    "Raymond",
    "Rebecca",
    "Richard",
    "Robert",
    "Sabrina",
    "Samantha",
    "Sarah",
    "Sean",
    "Shelby",
    "Sophie",
    "Spencer",
    "Stacy",
    "Stephanie",
    "Steven",
    "Sydney",
    "Thomas",
    "Tiffany",
    "Tim",
    "Todd",
    "Tran",
    "Travis",
    "Tyler",
    "Veronica",
    "Victoria",
    "Vivian",
    "Walter",
    "William",
    "Zoe"
  ];

  // 2018: 132 total (old strat missed 74)
  // 2019: 13 * 12 = 156 total
  // 2020: Same as 2019
  // console.log(`adj: ${adj.length - 1}`);

  // 2018: 130 total (old strat missed 64)
  // 2019: 14 * 11 = 154 total
  // 2020: Same as 2019
  // console.log(`name: ${name.length - 1}`);

  const golemContainer = document.querySelector(
    ".winterHunt2020HUD-golemContainer"
  );
  if (golemContainer) {
    golemContainer.addEventListener("click", function () {
      const golemClass = document.getElementsByClassName(
        "winterHunt2020HUD-popup-golem"
      );
      if (golemClass.length > 0) {
        for (let i = 0; i < 3; i++) {
          if (golemClass[i].classList.contains("visible")) {
            golemClass[i]
              .querySelector(
                ".winterHunt2020HUD-popup-golemDoll-scrambleButton"
              )
              .addEventListener("click", function () {
                generateText(golemClass[i]);
              });

            const partButtons = golemClass[i].querySelectorAll(
              ".winterHunt2020HUD-popup-golemDoll-control"
            );
            for (let partButton of partButtons) {
              partButton.addEventListener("click", function () {
                generateText(golemClass[i]);
              });
            }

            generateText(golemClass[i]);

            function generateText(golemClass) {
              // Reset if exists
              const existingSpan = document.getElementById("golem-name-span");
              if (existingSpan) existingSpan.remove();

              const golemArr = golemClass.querySelector(
                ".winterHunt2020HUD-customGolem"
              ).children;

              const headID = parseInt(golemArr[0].className.split("piece_")[1]);
              const armsID = parseInt(golemArr[1].className.split("piece_")[1]);
              const legsID = parseInt(golemArr[2].className.split("piece_")[1]);
              const torsoID = parseInt(
                golemArr[3].className.split("piece_")[1]
              );

              // Normalize array indices
              // 2018: 13 heads, 11 arms, 12 legs, 10 torsos
              // 2019: 14 heads, 12 arms, 13 legs, 11 torsos
              // 2020: Same as 2019
              let adjIndex = (armsID - 1) * 13 + legsID; // multiply by # legs
              if (adjIndex < 0) adjIndex = 0;
              let nameIndex = (torsoID - 1) * 14 + headID; // multiply by # heads
              if (nameIndex < 0) nameIndex = 0;
              const adjName = `${adj[adjIndex]} ${name[nameIndex]}`;

              // Derive font size
              let fontSize = 32;
              while (getTextWidth(adjName, `bold ${fontSize}px arial`) > 230) {
                fontSize--;
              }
              fontSize -= 3; // Prevent text overflow

              const textSpan = document.createElement("span");
              textSpan.id = "golem-name-span";
              textSpan.textContent = adjName;
              textSpan.setAttribute(
                "style",
                `z-index: 100; position: absolute; color: white; font-size: ${fontSize}px; font-weight: bold; left: 5px; top: 10px; text-align: center; text-shadow: 1px 1px 2px black; width: 240px;`
              );
              golemClass.appendChild(textSpan);
            }
            break;
          }
        }
      }
    });
  }

  /**
   * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
   *
   * @param {String} text The text to be rendered.
   * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
   *
   * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
   */
  function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas =
      getTextWidth.canvas ||
      (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
  }
})();
