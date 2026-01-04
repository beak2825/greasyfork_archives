// ==UserScript==
// @name         RewardARR(Broken)
// @version      5
// @description  Automatically search for Microsoft Rewards points with one click. Limit 5 tabs at a time. 10 lists, one chosen at random. Completion Message.
//               Page redirect to check points. As of 4.0 quizzes with multiple answers will be highlighted in pink to indicate a correct answer.
// @author       Claytauras and ChatGPT
// @match        https://www.bing.com/*
// @match        https://rewards.bing.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      AGPL-3.0-or-later
// @namespace RewardARR
// @downloadURL https://update.greasyfork.org/scripts/464408/RewardARR%28Broken%29.user.js
// @updateURL https://update.greasyfork.org/scripts/464408/RewardARR%28Broken%29.meta.js
// ==/UserScript==



    GM_addStyle(`
      [iscorrectoption="True"] {
        background-color: pink !important;
    }
`);
    setTimeout(function() {
    (function() {
        'use strict';

    // Create an image to trigger the search
    const img = document.createElement('img');
      img.style.position = 'absolute';
      img.style.top = '25px';
      img.style.left = '20px';
      img.style.zIndex = '9999';
      img.style.cursor = 'pointer';
      img.title = 'RewardARRR';

    // Set the image source to a static image
      img.src = 'https://i.postimg.cc/0Qgmy3Qk/unistatic.gif';

    // Set the animated GIF as the image source on hover
      img.addEventListener('mouseover', function() {
      img.src = 'https://i.postimg.cc/L8kpGy5Z/unicorn-joypixels.gif';
});

    // Set the static image as the image source on mouse out
      img.addEventListener('mouseout', function() {
      img.src = 'https://i.postimg.cc/0Qgmy3Qk/unistatic.gif';
});

    // Load the image to determine its natural size and adjust its width and height accordingly
      img.onload = function() {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const maxWidth = 100; // Adjust the maximum width to fit your needs
      const maxHeight = maxWidth / aspectRatio;
        img.style.width = `${maxWidth}px`;
        img.style.height = `${maxHeight}px`;
}


    // When the image is clicked, search for each
    img.addEventListener('click', function() {
        // Define the twenty arrays
      const stars1 = [
            'American Pie', 'The Big Lebowski', 'Theres Something About Mary', 'Austin Powers: The Spy Who Shagged Me', 'Office Space',
            'Analyze This', 'Notting Hill', 'Scary Movie', 'Meet the Parents', 'Zoolander',
            'Legally Blonde', 'My Big Fat Greek Wedding', 'Bridget Joness Diary', 'Old School', 'Elf',
            'Mean Girls', 'Dodgeball: A True Underdog Story', 'Shaun of the Dead', 'The 40-Year-Old Virgin', 'Talladega Nights: The Ballad of Ricky Bobby',
            'Borat', 'Hot Fuzz', 'Superbad', 'Step Brothers', 'The Hangover',
            'The Proposal', 'Bridesmaids', '21 Jump Street', 'This Is the End', 'The Heat',
            'The Other Woman', '22 Jump Street', 'Deadpool', 'Spy', 'The Nice Guys',
            'The Edge of Seventeen', 'Game Night', 'Blockers', 'Booksmart', 'Good Boys', 'Hustlers',
];
      const stars2 = [
            'The Ring', 'The Blair Witch Project', 'The Sixth Sense', 'The Others', 'The Grudge',
            '28 Days Later', 'Saw', 'Shaun of the Dead', 'The Descent', 'Hostel',
            'The Hills Have Eyes', 'The Orphanage', 'The Mist', 'Paranormal Activity', 'Let the Right One In',
            'Drag Me to Hell', 'Zombieland', 'The Cabin in the Woods', 'Sinister', 'The Conjuring',
            'Youre Next', 'The Babadook', 'It Follows', 'The Witch', 'Green Room',
            'Dont Breathe', 'The Autopsy of Jane Doe', 'Get Out', 'It', 'A Quiet Place',
            'Hereditary', 'Suspiria', 'Halloween', 'Us', 'Midsommar',
            'Doctor Sleep', 'The Invisible Man', 'The Lodge', 'The Lighthouse', 'This is the end',
];
      const stars3 = [
            'Michael Scott', 'Ron Burgundy', 'Lloyd Christmas and Harry Dunne', 'Ace Ventura', 'Borat Sagdiyev',
            'Austin Powers', 'Leslie Knope', 'Homer Simpson', 'Peter Griffin', 'Bart Simpson',
            'Dwight Schrute', 'Cosmo Kramer', 'Elaine Benes', 'Joey Tribbiani', 'Phoebe Buffay',
            'Chandler Bing', 'Michael Bluth', 'Buster Bluth', 'Tobias Funke', 'Lucille Bluth',
            'Andy Dwyer', 'Ron Swanson', 'April Ludgate', 'Barney Stinson', 'Ted Mosby',
            'Marshall Eriksen', 'Lily Aldrin', 'Saul Goodman', 'Jesse Pinkman', 'Walter White',
            'The Dude', 'Napoleon Dynamite', 'Jack Sparrow', 'Tony Stark Iron Man', 'Deadpool',
            'Marty McFly', 'Ferris Bueller', 'Clark Griswold', 'The Ghostbusters',
];

      const star4 = [
            'Micky Mouse', 'Bugs Bunny', 'Tom and Jerry', 'SpongeBob SquarePants', 'Donald Duck',
            'Daffy Duck', 'Scooby-Doo', 'Pikachu', 'Tweety Bird', 'Road Runner',
            'Woody Woodpecker', 'Garfield', 'Charlie Brown', 'Snoopy', 'Fred Flintstone',
            'Barney Rubble', 'George Jetson', 'Astro', 'Optimus Prime', 'Megatron',
            'Bumblebee', 'He-Man', 'Skeletor', 'Leonardo', 'Michelangelo',
            'Donatello - Teenage Mutant Ninja Turtles', 'Raphael', 'Ash Ketchum', 'Goku',
            'Vegeta - Dragon Ball Z', 'Sailor Moon', 'Yosemite Sam', 'Elmer Fudd',
            'Popeye', 'Olive Oyl', 'Pink Panther', 'Sonic the Hedgehog', 'Taz - Tasmanian Devil','Bugs Bunny', 'Yosemite Sam'
];
      const star5 = [
            'Indiana Jones', 'John McClane', 'Martin Riggs', 'Max Rockatansky', 'RoboCop',
            'The Terminator', 'John Rambo', 'Rocky Balboa', 'Axel Foley', 'Jack Burton',
            'Tommy DeVito', 'Eddie Hawkin', 'Tony Montana', 'Marv', 'John Matrix',
            'Frank Dux', 'Dutch', 'Blade', 'Ash Williams', 'Snake Plissken',
            'Rick Deckard - Blade Runner', 'Ellen Ripley - Aliens', 'Marty McFly - Back to the Future', 'James Bond', 'Jason Bourne',
            'John Connor', 'Jack Ryan', 'John Shaft', 'Inspector Lee', 'John Spartan',
            'Jean-Claude Van Damme', 'Steven Seagal', 'Wesley Snipes', 'will smith', 'Bruce Willis',
            'Harrison Ford', 'Arnold Schwarzenegger', 'Keanu Reeves', 'Nicolas Cage', 'Mel Gibson'
];
      const star6 = [
            'Bedrock', 'Hill Valley', 'South Park', 'Springfield', 'Bikini Bottom',
            'Metropolis', 'Gotham City', 'Sunnydale', 'Pawnee', 'Quahog',
            'Stars Hollow', 'Mayberry', 'Gotham City', 'Bannerman - Stephen King', 'Westeros - Game of Thrones',
            'Riverdale', 'Derry - Stephen King', 'Mystic Falls - The Vampire Diaries', 'Hawkins - Stranger Things', 'Greendale',
            'Pleasantville', 'Salem - Sabrina the Teenage Witch', 'Spectre - Big Fish', 'Dillon - Friday Night Lights', 'Sunnydale',
            'Wakanda - Black Panther', 'Hilltop - The Walking Dead', 'Haddonfield - Halloween', 'Chesters Mill - Under the Dome', 'Amity Island - Jaws',
            'Capeside - Dawsons Creek', 'Hickory - Hoosiers', 'Mayfield - Leave it to Beaver', 'Forks - Twilight', 'Dunder Mifflin - The Office',
            'Central Perk - Friends', 'Silent Hill - Silent Hill', 'Kings Landing - Game of Thrones', 'Storybrooke - Once Upon a Time', 'Pleasantville'
];
      const stars7 = [
            'Led Zeppelin', 'The Beatles', 'Queen', 'The Rolling Stones', 'Pink Floyd',
            'AC/DC', 'Guns N Roses', 'Nirvana', 'U2', 'Metallica',
            'The Who', 'Black Sabbath', 'Foo Fighters', 'Green Day', 'Red Hot Chili Peppers',
            'Pearl Jam', 'Bon Jovi', 'Radiohead', 'Coldplay', 'Linkin Park',
            'The Doors', 'Oasis', 'R.E.M.', 'The Clash', 'Iron Maiden',
            'Def Leppard', 'Aerosmith', 'Deep Purple', 'The Police', 'Foo Fighters',
            'Muse', 'Arctic Monkeys', 'System of a Down', 'Paramore', 'Kings of Leon',
            'The Killers', 'Fall Out Boy', 'Imagine Dragons', 'Twenty One Pilots', 'Panic! at the Disco'
];
      const stars8 = [
            'Fortnite', 'Minecraft', 'Grand Theft Auto V', 'The Legend of Zelda: Breath of the Wild', 'PlayerUnknowns Battlegrounds',
            'Overwatch', 'Call of Duty: Warzone', 'Apex Legends', 'FIFA 22', 'Super Mario Odyssey',
            'Red Dead Redemption 2', 'Assassins Creed Valhalla', 'Cyberpunk 2077', 'Final Fantasy VII Remake', 'Among Us',
            'Mortal Kombat 11', 'God of War', 'Halo Infinite', 'Fallout 4', 'The Witcher 3: Wild Hunt',
            'Madden NFL 22', 'Pokémon Sword and Shield', 'Rocket League', 'Destiny 2', 'Borderlands 3',
            'Animal Crossing: New Horizons', 'World of Warcraft', 'League of Legends', 'Counter-Strike: Global Offensive', 'The Elder Scrolls V: Skyrim',
            'Super Smash Bros. Ultimate', 'Mass Effect: Legendary Edition', 'Resident Evil Village', 'Fortnite Chapter 2', 'Genshin Impact',
            'Street Fighter V', 'Doom Eternal', 'Marvels Spider-Man: Miles Morales', 'Bioshock Infinite', 'Tom Clancys Rainbow Six Siege'
];
      const stars9 = [
            'Saving Private Ryan', 'Apocalypse Now', 'Dunkirk', 'Schindlers List', 'Full Metal Jacket',
            'Platoon', 'Black Hawk Down', 'The Thin Red Line', 'Braveheart', 'Hacksaw Ridge',
            'Fury', '1917', 'The Deer Hunter', 'Bridge of Spies', 'Letters from Iwo Jima',
            'The Hurt Locker', 'Glory', 'Enemy at the Gates', 'Inglourious Basterds', 'The Patriot',
            'American Sniper', 'The Great Escape', 'We Were Soldiers', 'The Bridge on the River Kwai', 'Paths of Glory',
            'Casualties of War', 'A Bridge Too Far', 'Zero Dark Thirty', 'Tora! Tora! Tora!', 'The Dirty Dozen',
            'War Horse', 'The Longest Day', 'The Battle of Midway', 'The Guns of Navarone', 'Gettysburg',
            'Pearl Harbor', 'Stalingrad', 'The Thin Red Line', 'Windtalkers', 'The Big Red One', 'Behind Enemy Lines'
];
      const stars10 = [
            'Captain James T. Kirk', 'Spock', 'Captain Jean-Luc Picard', 'Data', 'Commander William Riker',
            'Lieutenant Worf', 'Dr. Leonard McCoy', 'Scotty', 'Uhura', 'Chekov',
            'Sulu', 'Captain Benjamin Sisko', 'Quark', 'Major Kira Nerys', 'Odo',
            'Jadzia Dax', 'Worf', 'Captain Kathryn Janeway', 'Chakotay', 'The Doctor',
            'Seven of Nine', 'Tuvok', 'Neelix', 'Ensign Harry Kim', 'Captain Jonathan Archer',
            'T Pol', 'Trip Tucker', 'Dr. Phlox', 'Malcolm Reed', 'Hoshi Sato',
            'Commander Charles "Trip" Tucker III', 'Captain Gabriel Lorca', 'Michael Burnham', 'Saru', 'Sylvia Tilly',
            'Ash Tyler', 'Paul Stamets', 'Hugh Culber', 'L Rell', 'Empress Georgiou', 'Nhan'
];
      const star11 = [
            'Mario Bros.', 'The Legend of Zelda', 'Super Mario Bros.', 'Metroid', 'Mega Man',
            'Final Fantasy', 'Castlevania', 'Contra', 'Punch-Out!!', 'Tetris', 'Double Dragon',
            'Kid Icarus', 'Duck Hunt', 'Excitebike', 'Donkey Kong', 'Zelda II: The Adventure of Link',
            'Kirbys Adventure','Teenage Mutant Ninja Turtles', 'Super Mario Bros. 3', 'Balloon Fight', 'Ice Climber',
            'Dr. Mario', 'Gradius', 'Battletoads', 'Bubble Bobble', 'Mike Tysons Punch-Out!!',
            'Ninja Gaiden', 'Zelda II: The Adventure of Link', 'Dragon Warrior', 'Ghosts n Goblins', 'StarTropics',
            'Castlevania II: Simons Quest', 'Super C', 'Bionic Commando', 'Super Mario Bros. 2',
            'Adventure Island', 'Blades of Steel', 'RC Pro-Am', 'Tecmo Bowl', 'Gauntlet', 'Super Dodge Ball'
];
      const star12 = [
            'Excitebike 64', 'Galaga', 'Bubble Bobble', 'Mega Man 2', 'Metroid Prime',
            'Castlevania III: Draculas Curse', 'Contra Force', 'Battletoads & Double Dragon', 'Super Mario Bros.: The Lost Levels',
            'Kirbys Adventure', 'Teenage Mutant Ninja Turtles II: The Arcade Game', 'Punch-Out!! Featuring Mr. Dream', 'Super Mario Bros. Deluxe', 'Donkey Kong Country',
            'Final Fantasy III', 'Dragon Quest IV: Chapters of the Chosen', 'Mega Man 3', 'The Legend of Zelda: A Link to the Past', 'Super Mario World',
            'Super Mario Kart', 'Street Fighter II Turbo', 'Star Fox', 'EarthBound', 'Chrono Trigger',
            'Super Metroid', 'F-Zero', 'Super Punch-Out!!', 'Super Castlevania IV', 'Kirby Super Star',
            'Super Mario RPG: Legend of the Seven Stars', 'Ninja Gaiden II: The Dark Sword of Chaos', 'Teenage Mutant Ninja Turtles III: The Manhattan Project', 'Contra III: The Alien Wars',
            'Castlevania: Bloodlines', 'Final Fight', 'Double Dragon II: The Revenge', 'Battletoads in Battlemaniacs', 'The Legend of Zelda: Links Awakening',
            'Super Street Fighter II: The New Challengers', 'Mega Man X', 'Donkey Kong Country 2: Diddys Kong Quest', 'Super Mario All-Stars'
];
      const star13 = [
            'Super Mario World', 'The Legend of Zelda: A Link to the Past', 'Super Metroid', 'Chrono Trigger', 'Final Fantasy VI',
            'Super Mario Kart', 'Donkey Kong Country', 'Mega Man X', 'Street Fighter II Turbo', 'Super Castlevania IV',
            'Super Mario RPG: Legend of the Seven Stars', 'Super Mario World 2: Yoshis Island', 'Star Fox', 'F-Zero', 'EarthBound',
            'Super Punch-Out!!', 'Secret of Mana', 'Super Mario All-Stars', 'Final Fantasy IV', 'Mega Man X2',
            'The Legend of Zelda: Link to the Past and Four Swords', 'Donkey Kong Country 2: Diddys Kong Quest', 'Kirby Super Star', 'Super Ghouls n Ghosts', 'Super Street Fighter II: The New Challengers',
            'Super Mario World 2: Yoshis Island', 'Super Mario Kart: Super Circuit', 'Contra III: The Alien Wars', 'Teenage Mutant Ninja Turtles IV: Turtles in Time', 'Donkey Kong Country 3: Dixie Kongs Double Trouble!',
            'Super Bomberman', 'Secret of Evermore', 'Illusion of Gaia', 'Super Mario All-Stars + Super Mario World', 'Final Fantasy V',
            'Mega Man X3', 'Super Star Wars', 'Kirbys Dream Land 3', 'ActRaiser', 'Terranigma'
];
      const star14 = [
            'Sonic the Hedgehog', 'Streets of Rage', 'Golden Axe', 'Shinobi', 'Altered Beast',
            'Mortal Kombat', 'Street Fighter II', 'Ecco the Dolphin', 'Phantasy Star', 'Sonic the Hedgehog 2',
            'Gunstar Heroes', 'Vectorman', 'ToeJam & Earl', 'OutRun', 'Shining Force',
            'Sonic the Hedgehog 3', 'Streets of Rage 2', 'Aladdin', 'Sonic & Knuckles', 'Castlevania: Bloodlines',
            'Comix Zone', 'Earthworm Jim', 'Shining Force II', 'Ristar', 'Eternal Champions',
            'Sonic CD', 'Kid Chameleon', 'Shinobi III: Return of the Ninja Master', 'Phantasy Star IV', 'Columns',
            'Thunder Force III', 'Splatterhouse 2', 'Golden Axe II', 'Ecco: The Tides of Time', 'Wonder Boy III: The Dragons Trap',
            'Shining in the Darkness', 'Streets of Rage 3', 'ToeJam & Earl in Panic on Funkotron', 'Sonic 3D Blast', 'Phantasy Star II'
];
      const star15 = [
            'Sonic & Knuckles', 'Streets of Rage 2', 'Gunstar Heroes', 'Vectorman', 'Comix Zone',
            'Shining Force', 'Ecco the Dolphin', 'Phantasy Star', 'Sonic the Hedgehog 2', 'Shinobi III: Return of the Ninja Master',
            'ToeJam & Earl', 'Altered Beast', 'Sonic the Hedgehog 3', 'Sonic CD', 'Golden Axe',
            'Streets of Rage', 'Mortal Kombat II', 'Shining Force II', 'Eternal Champions', 'Ristar',
            'Sonic Spinball', 'Kid Chameleon', 'Earthworm Jim', 'Shinobi', 'Columns',
            'Sonic 3D Blast', 'Landstalker', 'Aladdin', 'Phantasy Star IV', 'Beyond Oasis',
            'Streets of Rage 3', 'Shining in the Darkness', 'Vectorman 2', 'ToeJam & Earl in Panic on Funkotron', 'Sonic & Knuckles Collection',
            'Ecco: The Tides of Time', 'Wonder Boy in Monster World', 'Golden Axe II', 'Rocket Knight Adventures', 'Mega Bomberman', 'The Revenge of Shinobi'
];
      const star16 = [
            'Mario', 'Luigi', 'Link', 'Zelda', 'Samus Aran',
            'Master Chief', 'Kratos', 'Nathan Drake', 'Solid Snake', 'Geralt of Rivia',
            'Cloud Strife', 'Sonic the Hedgehog', 'Pac-Man', 'Donkey Kong', 'Mega Man',
            'Lara Croft', 'Baby Mario', 'Princess Peach', 'Yoshi', 'Bowser',
            'Kirby', 'Fox McCloud', 'Cortana', 'Aloy', 'Arthur Morgan',
            'Joel and Ellie', 'Ezio Auditore', 'Altair Ibn-LaAhad', 'CJ Johnson', 'Trevor Phillips',
            'Niko Bellic', 'Leon S. Kennedy', 'Jill Valentine', 'Aloy', 'Kratos',
            'Clementine', 'Max Caulfield', 'Ellie', 'Doom Slayer', 'Gordon Freeman', 'Aloy', 'Eivor'
];
      const star17 = [
            'Tatooine', 'Krypton', 'Pandora', 'Hoth', 'Naboo',
            'Arrakis', 'Cybertron', 'Gotham', 'Alderaan', 'Mars',
            'Endor', 'Vulcan', 'Coruscant', 'Gallifrey', 'Pern',
            'Pandora', 'Eternia', 'Pikmin Planet', 'Mushroom Kingdom', 'Azeroth',
            'Middle-earth', 'Westeros', 'Hogwarts', 'Atlantis', 'Xandar',
            'Moya', 'Magrathea', 'Hala', 'Krypton', 'Gallifrey',
            'Pern', 'Zebes', 'Cybertron', 'Kashyyyk', 'Caprica',
            'Korriban', 'Mirkwood', 'Pandora', 'Abydos', 'Nirn'
];
      const star18 = [
            'Luminescent Lavender', 'Mystic Merlot', 'Celestial Cerulean', 'Opulent Orchid', 'Radiant Raspberry',
            'Enigmatic Emerald', 'Ethereal Amethyst', 'Vibrant Vermilion', 'Aurora Azure', 'Gilded Gold',
            'Whimsical Watermelon', 'Pearlescent Periwinkle', 'Sapphire Serenade', 'Turquoise Tantalite', 'Crimson Cascade',
            'Molten Magenta', 'Jade Jamboree', 'Cobalt Crystal', 'Citronella Sunrise', 'Taffy Tangerine',
            'Majestic Maroon', 'Chartreuse Charisma', 'Indigo Illusion', 'Caramel Cosmos', 'Carnelian Coral',
            'Quicksilver Slate', 'Rose Quartz Radiance', 'Luscious Lemon', 'Plum Passion', 'Amber Ambrosia',
            'Topaz Twilight', 'Cyan Symphony', 'Terra Cotta Tempest', 'Lapis Lazuli', 'Fuchsia Fantasy',
            'Goldenrod Glow', 'Onyx Obsidian', 'Lemongrass Luster', 'Turmeric Tango', 'Saffron Shimmer',
];
      const star19 = [
            'Quokka', 'Axolotl', 'Okapi', 'Fennec Fox', 'Sloth',
            'Platypus', 'Narwhal', 'Chameleon', 'Red Panda', 'Tarsier',
            'Serval', 'Blue-footed Booby', 'Arctic Fox', 'Capybara', 'Pangolin',
            'Kangaroo', 'Lemur', 'Sugar Glider', 'Aye-aye', 'Slow Loris', 'Coati',
            'Kookaburra', 'Binturong', 'Fossa', 'Mantis Shrimp', 'Jellyfish',
            'Leafy Sea Dragon', 'Quetzal', 'Toucan', 'Sawfish', 'Wombat',
            'Fairy Armadillo', 'Glaucus Atlanticus', 'Nudibranch', 'African Civet', 'Malayan Tapir',
            'Red-eyed Tree Frog', 'Numbat', 'Ring-tailed Lemur', 'Sunda Colugo', 'Pink Fairy Armadillo'
];
      const star20 = [
            'Lake Superior', 'Lake Victoria', 'Lake Huron', 'Lake Michigan', 'Lake Tanganyika',
            'Great Bear Lake', 'Lake Baikal', 'Lake Malawi', 'Great Slave Lake', 'Lake Erie',
            'Lake Winnipeg', 'Lake Ontario', 'Lake Balkhash', 'Lake Ladoga', 'Lake Vostok',
            'Lake Nipigon', 'Lake Athabasca', 'Lake Titicaca', 'Lake Turkana', 'Lake Nicaragua',
            'Lake Rukwa', 'Lake Kariba', 'Lake Eyre', 'Lake Tana', 'Lake Winnipegosis',
            'Lake Maracaibo', 'Lake Van', 'Lake Geneva', 'Lake Albert', 'Lake Tiberias (Sea of Galilee)',
            'Lake Chad', 'Lake Hovsgol', 'Lake Biwa', 'Lake Urmia', 'Lake Teletskoye',
            'Lake Peipus', 'Lake Tai', 'Lake Qaraoun', 'Lake Prespa', 'Lake Toba', 'Lake Ohrid'
];
      // Combine the 20 arrays into one array of arrays
      const allStars = [stars1, stars2, stars3, star4, star5, star6, stars7, stars8, stars9, stars10, star11, star12, star13, star14, star15, star16, star17, star18, star19, star20];

      // Select a random array from the allStars array
      const randomIndex = Math.floor(Math.random() * allStars.length);
      const stars = allStars[randomIndex];
      const queriesPerSet = 5;
      const setDelaySeconds = 4;
      const numSets = Math.ceil(stars.length / queriesPerSet);

          let currentIndex = 0;

      const searchSet = function() {
        const pages = [];

      for (let i = 0; i < queriesPerSet; i++) {
      const starIndex = currentIndex + i;
        if (starIndex < stars.length) {
      const star = stars[starIndex];
      const page = window.open(`https://www.bing.com/search?q=${encodeURIComponent(star)}`);
      pages.push(page);
    }
  }

      setTimeout(function() {
        for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
        if (!page.closed) {
        page.close();
      }
    }

      currentIndex += queriesPerSet;
        if (currentIndex < stars.length) {
      setTimeout(searchSet, setDelaySeconds * 1000);
      } else {
      // Create the message box element
      const messageBox = document.createElement('div');
        messageBox.style.backgroundColor = 'rgba(245, 40, 145, 0.8)'; // Set the background color with alpha to create a glowing effect
        messageBox.style.boxShadow = '0 0 20px 20px rgba(245, 40, 145, 0.8)'; // Add a box shadow to enhance the glowing effect
        messageBox.style.borderRadius = '10px'; // Add a border radius to make the box more rounded
        messageBox.style.padding = '20px';
        messageBox.style.fontSize = '50px';
        messageBox.style.fontWeight = 'bold';
        messageBox.style.textAlign = 'center'; // Center the text horizontally
        messageBox.style.position = 'fixed';
        messageBox.style.top = '50%';
        messageBox.style.left = '50%';
        messageBox.style.transform = 'translate(-50%, -50%)';
        messageBox.style.zIndex = '9999';


      // Create the message text element
      const messageText = document.createElement('p');
        messageText.textContent = 'Redirecting you to the rewards dashborad to check your points.';
        messageText.style.color = 'black'; // Set the text color to black
        messageBox.appendChild(messageText);

      // Add the message box element to the page
      document.body.appendChild(messageBox);



                    setTimeout(function() {
                        window.location.href = 'https://rewards.bing.com/pointsbreakdown';
                      }, 6000);

                }
            }, setDelaySeconds * 800);
        };

        searchSet();
    });

      // Check if the current page is Bing or Bing Rewards
      const isBingPage = window.location.hostname === 'www.bing.com';
      const isRewardsPage = window.location.hostname === 'rewards.bing.com';
          if (isBingPage || isRewardsPage) {
      // Add the image to the top left corner of the page
      document.body.appendChild(img);
}

})();
      }, 3000);
