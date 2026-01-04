// ==UserScript==
// @name         Bing Rewards
// @description  Autoclick on Bing Reward quiz
// @version      0.4
// @author       DuctTape
// @license      MIT
// @match        https://www.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @namespace https://greasyfork.org/users/1217891
// @downloadURL https://update.greasyfork.org/scripts/479956/Bing%20Rewards.user.js
// @updateURL https://update.greasyfork.org/scripts/479956/Bing%20Rewards.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function generateRandomSentence() {
        const subjects = [
            'The cat', 'A dog', 'My friend', 'A mysterious stranger', 'The old tree',
            'A curious child', 'The wise owl', 'The playful kitten', 'An adventurous explorer',
            'A wise wizard', 'The gentle breeze', 'The singing bird', 'The roaring lion',
            'The majestic mountain', 'The sparkling river', 'The ancient scroll', 'The hidden treasure',
            'The magical potion', 'The brave knight', 'The mischievous monkey', 'The colorful butterfly',
            'The laughing hyena', 'The sleepy bear', 'The tiny squirrel', 'The wise elder',
            'The playful dolphin', 'The graceful swan', 'The fast cheetah', 'The golden sunrise',
            'The mysterious cave', 'The ancient ruins', 'The secret passage', 'The sweet melody',
            'The distant galaxy', 'The radiant sunflower', 'The enchanted forest', 'The cosmic traveler',
            'The whistling wind', 'The sparkling diamond', 'The glowing firefly', 'The distant horizon',
            'The joyful celebration', 'The ancient prophecy', 'The forgotten legend', 'The vibrant rainbow',
            'The peaceful meadow', 'The swirling vortex', 'The tranquil ocean', 'The shimmering starlight',
            'The playful breeze', 'The magical carpet', 'The celestial dancer', 'The cosmic journey',
            'The ancient oracle', 'The radiant moonlight', 'The mystical waterfall', 'The ancient city',
            'The whispering willow', 'The dazzling comet', 'The twilight serenade', 'The cosmic kaleidoscope',
            'The starry night', 'The whispering pine', 'The ancient tome', 'The radiant gemstone',
            'The mystical portal', 'The serene lake', 'The radiant blossom', 'The eternal flame',
            'The tranquil oasis', 'The cosmic dust', 'The ethereal realm', 'The enchanted melody',
            'The cosmic heartbeat', 'The ancient artifact', 'The cosmic harmony', 'The shimmering mirage',
            'The celestial navigation', 'The radiant aurora', 'The mystical riddle', 'The cosmic ballet',
            'The ancient scribe', 'The timeless journey', 'The ethereal fog', 'The enchanted tapestry',
            'The celestial symphony', 'The radiant dawn', 'The cosmic lullaby', 'The ancient hymn',
            'The cosmic messenger', 'The radiant beacon', 'The eternal voyage', 'The ancient mural'
        ];

        const verbs = [
            'jumped', 'ran', 'slept', 'sang', 'discovered', 'whispered', 'laughed', 'cried',
            'danced', 'flew', 'smiled', 'giggled', 'wandered', 'listened', 'pondered', 'gazed',
            'floated', 'swirled', 'soared', 'skipped', 'navigated', 'echoed', 'sailed', 'chanted',
            'glowed', 'sparkled', 'wished', 'murmured', 'darted', 'meandered', 'dreamed', 'strolled',
            'leaped', 'savored', 'twinkled', 'roamed', 'beckoned', 'whirled', 'swooped', 'whistled',
            'cascaded', 'glimmered', 'hoped', 'tumbled', 'glistened', 'stirred', 'charmed', 'blossomed',
            'beckoned', 'shimmered', 'spiraled', 'enchant', 'skipped', 'capered', 'traveled', 'cascaded',
            'glimpsed', 'frolicked', 'twirled', 'lull', 'sparkled', 'perched', 'captivated', 'plummeted',
            'glowed', 'whispered', 'waltzed', 'intertwined', 'jovial', 'resonated', 'tiptoed', 'illuminated',
            'enveloped', 'mystified', 'embrace', 'stargazed', 'tranquil', 'effervescent', 'ethereal', 'caressed',
            'captured', 'mesmerized', 'whimsical', 'illuminate', 'illustrious', 'swayed', 'delight', 'reverie',
            'tranquil', 'serene', 'enchanted', 'astral', 'allured', 'glissade', 'radiant', 'climbed'
        ];

        const objects = [
            'over the moon', 'through the forest', 'on a sunny day', 'with joy',
            'in the enchanted garden', 'underneath the stars', 'around the ancient castle',
            'beneath the rainbow', 'between the clouds', 'beside the waterfall', 'within the mist',
            'inside the labyrinth', 'across the meadow', 'amidst the fireflies', 'along the horizon',
            'amidst the blossoms', 'around the campfire', 'beside the riverbank', 'through the time portal',
            'past the hidden doorway', 'toward the unknown', 'along the moonlit path', 'within the cosmic waves',
            'inside the cosmic cavern', 'through the whispering pines', 'among the ancient stones', 'within the dreamland',
            'across the celestial plains', 'beside the starlit shore', 'inside the secret garden', 'around the celestial sphere',
            'within the cosmic tapestry', 'through the ethereal mist', 'among the astral winds', 'across the luminous sea',
            'toward the cosmic haven', 'amidst the shimmering mirage', 'across the astral expanse', 'inside the cosmic capsule',
            'along the celestial pathway', 'beyond the radiant horizon', 'through the astral doorway', 'within the cosmic realm',
            'across the starry canvas', 'beside the lunar fountain', 'within the cosmic array', 'across the ethereal sky',
            'along the celestial arc', 'inside the astral sphere', 'through the radiant portal', 'around the cosmic vortex',
            'among the stardust particles', 'across the celestial meadow', 'beside the astral cascade', 'inside the ethereal cocoon',
            'within the cosmic embrace', 'around the astral belt', 'amidst the radiant twilight', 'through the astral canopy',
            'along the cosmic trajectory', 'beside the ethereal lagoon', 'across the starry tapestry', 'within the celestial compass',
            'through the astral gateway', 'around the radiant beacon', 'across the cosmic expanse', 'inside the astral cathedral',
            'among the luminous nebulae', 'through the celestial dance', 'around the astral spiral', 'beside the radiant meridian',
            'inside the cosmic chamber', 'across the ethereal zephyr', 'within the astral sanctuary', 'along the celestial meridian',
            'amidst the radiant arch', 'through the ethereal cascade', 'beside the astral sanctuary', 'around the cosmic nucleus',
            'within the astral tapestry', 'across the celestial mosaic', 'beside the radiant zenith', 'along the cosmic trail',
            'amidst the ethereal panorama', 'through the celestial voyage', 'inside the astral continuum', 'around the radiant ellipse',
            'within the cosmic aurora', 'through the astral vortex', 'beside the ethereal cascade',
            'amidst the radiant meadow', 'across the celestial valley', 'inside the astral cocoon',
            'within the ethereal embrace', 'around the cosmic sanctuary', 'along the celestial trajectory',
            'through the radiant expanse', 'beside the astral fountain', 'amidst the ethereal panorama',
            'across the celestial mosaic', 'beside the radiant zenith', 'along the cosmic trail',
            'amidst the ethereal panorama', 'through the celestial voyage', 'inside the astral continuum',
            'around the radiant ellipse', 'within the astral cascade', 'across the celestial meadow',
            'beside the astral cascade', 'inside the ethereal cocoon', 'within the cosmic embrace',
            'around the astral belt', 'amidst the radiant twilight', 'through the astral canopy',
            'along the cosmic trajectory', 'beside the ethereal lagoon', 'across the starry tapestry',
            'within the celestial compass', 'through the astral gateway', 'around the radiant beacon',
            'across the cosmic expanse', 'inside the astral cathedral', 'among the luminous nebulae',
            'through the celestial dance', 'around the astral spiral', 'beside the radiant meridian',
            'inside the cosmic chamber', 'across the ethereal zephyr', 'within the astral sanctuary',
            'along the celestial meridian', 'amidst the radiant arch', 'through the ethereal cascade',
            'beside the astral sanctuary', 'around the cosmic nucleus', 'within the astral tapestry',
            'across the celestial mosaic', 'beside the radiant zenith', 'along the cosmic trail',
            'amidst the ethereal panorama', 'through the celestial voyage', 'inside the astral continuum',
            'around the radiant ellipse', 'within the astral cascade', 'across the celestial meadow',
            'beside the astral cascade', 'inside the ethereal cocoon', 'within the cosmic embrace',
            'around the astral belt', 'amidst the radiant twilight', 'through the astral canopy',
            'along the cosmic trajectory', 'beside the ethereal lagoon', 'across the starry tapestry',
            'within the celestial compass', 'through the astral gateway', 'around the radiant beacon',
            'across the cosmic expanse', 'inside the astral cathedral', 'among the luminous nebulae',
            'through the celestial dance', 'around the astral spiral', 'beside the radiant meridian',
            'inside the cosmic chamber', 'across the ethereal zephyr', 'within the astral sanctuary',
            'along the celestial meridian', 'amidst the radiant arch', 'through the ethereal cascade',
            'beside the astral sanctuary', 'around the cosmic nucleus', 'within the astral tapestry',
            'across the celestial mosaic', 'beside the radiant zenith', 'along the cosmic trail',
            'amidst the ethereal panorama', 'through the celestial voyage', 'inside the astral continuum',
            'around the radiant ellipse'
        ];

        const getRandomElement = array => array[Math.floor(Math.random() * array.length)];

        const subject = getRandomElement(subjects);
        const verb = getRandomElement(verbs);
        const object = getRandomElement(objects);

        return `${subject} ${verb} ${object}.`;
    }

    function getParameterFromUrl(parameterName) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(parameterName);
    }

    setTimeout(function() {
        var correctElements = document.querySelectorAll('[iscorrectoption="True"]'); // Used for a quiz with multiple correct answers

        if (correctElements.length === 0) {
            correctElements = document.querySelectorAll('.rqOption'); // used for a quiz with a single answer
        }

        if (correctElements.length === 0) {
            correctElements = document.querySelectorAll('.btOption') // used for a daily poll
        }

        correctElements.forEach(function(element) {
            element.click();
        });
    }, 1000);

    if (getParameterFromUrl('randomSearch') === '1') {
        let amount = parseInt(getParameterFromUrl('randomSearchAmount')) + 1;

        if (amount < 30) {
            setTimeout(function() {
                window.open('https://www.bing.com/search?q=' + generateRandomSentence() + '&form=' + getParameterFromUrl('form') + '&ghc=1&lq=0&ghsh=0&ghacc=0&ghpl=&randomSearch=1&randomSearchAmount=' + amount, '_self')
            }, 7000);
        }
    }

    var scopebarElement = document.querySelector('.b_scopebar');
    if (scopebarElement) {
        var newItem = document.createElement('li');
        newItem.class = 'tools_scope';

        var newLink = document.createElement('a');
        newLink.href = 'https://www.bing.com/search?q=' + generateRandomSentence() + '&form=' + getParameterFromUrl('form') + '&ghc=1&lq=0&ghsh=0&ghacc=0&ghpl=&randomSearch=1&randomSearchAmount=1';
        newLink.textContent = 'Start random search';
        newLink.style.color = 'red';

        newItem.appendChild(newLink);
        newItem.classList.add('tools_scope');

        var ulElement = scopebarElement.querySelector('ul');

        ulElement.appendChild(newItem);
    }
})();