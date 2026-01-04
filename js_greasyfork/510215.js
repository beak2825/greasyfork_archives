// ==UserScript==
// @name         RYM Descriptor Organizer
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  Organize descriptors automatically on RateYourMusic
// @author       https://greasyfork.org/users/1320826-polachek
// @match        *://rateyourmusic.com/*
// @grant        none
// @license      MIT
// @icon         https://pbs.twimg.com/media/D6S7qRjUEAEVE6s.png
// @downloadURL https://update.greasyfork.org/scripts/510215/RYM%20Descriptor%20Organizer.user.js
// @updateURL https://update.greasyfork.org/scripts/510215/RYM%20Descriptor%20Organizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const categories = {
        Theme: [
            'theme', 'abstract', 'alienation', 'conscious', 'crime', 'death', 'suicide',
            'drugs', 'alcohol', 'educational', 'fantasy', 'folklore', 'hedonism',
            'history', 'holiday', 'Christmas', 'Halloween', 'ideology', 'anti-religious',
            'pagan', 'political', 'anarchism', 'nationalism', 'propaganda', 'protest',
            'religious', 'Christian', 'Islamic', 'satanism', 'introspective', 'LGBTQ',
            'love', 'breakup', 'mythology', 'nature', 'occult', 'paranormal', 'patriotic',
            'philosophical', 'existential', 'nihilistic', 'science fiction', 'self-hatred',
            'sexual', 'sports', 'violence', 'war', 'animals', 'Hindu', 'Sikh', 'Buddhist',
            'family', 'friendship', 'transgender', 'lesbian', 'food', 'travel', 'money',
            'socialism', 'fashion', 'vegetarianism', 'pacifism', 'macabre', 'cannabis',
            'internet', 'feminism', 'Judaic', 'domestic', 'ageing', 'dystopian', 'infidelity',
            'Carnaval', 'nostalgia', 'conservatism', 'poverty', 'vehicles', 'antiquity',
            'homicide', 'video games', 'regret', 'envy', 'paranoia', 'literature', 'bisexual',
            'disease', 'environmentalism', 'health', 'childhood', 'grief', 'nonbinary', 'opiods',
            'school', 'betrayal', 'pirates', 'suburban', 'fame', 'film', 'prison', 'guns',
            'escapism', 'Bahá\'í', 'loyalty', 'dancing', 'mental health', 'fitness', 'television',
            'police', 'history', 'cyberpunk', 'gender', 'afterlife', 'marriage', 'about music',
            'parenthood', 'conspiracy', 'addiction', 'failure', 'comics', 'gay', 'Rastafari',
            'cocaine', 'work', 'sleep', 'self-love', 'leisure', 'dreams', 'adolescence', 'birthday',
            'obsession', 'Wild West', 'anticolonialism','vikings', 'jain', 'sobriety',
            'apology', 'community', 'greed', 'anime and manga', 'wrestling', 'hallucinogens',
            'aliens', 'gambling', 'Biblical', 'anti-authoritarian', 'basketball', 'disaster',
            'science', 'cosmetics', 'horror', 'time', 'technology', 'visual arts', 'radio',
            'robots', 'nightlife', 'gore', 'courage', 'pets', 'drought', 'vengeance', 'trauma',
            'fairy tale', 'farming', 'skateboarding', 'hunting', 'migration', 'plants'
        ],

        Tone: [
            'tone', 'altruistic', 'apathetic', 'boastful', 'cryptic', 'deadpan', 'hateful',
            'humorous', 'insecure', 'menacing', 'misanthropic', 'optimistic', 'pessimistic',
            'poetic', 'provocative', 'rebellious', 'sarcastic', 'satirical', 'serious', 'vulgar',
            'dark humor', 'compassionate', 'cynical'
        ],


        Atmosphere: [
            'apocalyptic', 'cold', 'dark', 'funereal', 'infernal', 'ominous', 'scary',
            'epic', 'ethereal', 'futuristic', 'hypnotic', 'martial', 'mechanical',
            'medieval', 'mysterious', 'natural', 'aquatic', 'desert', 'forest',
            'rain', 'tropical', 'nocturnal', 'party', 'pastoral', 'peaceful',
            'psychedelic', 'ritualistic', 'seasonal', 'autumn', 'spring', 'summer',
            'winter', 'space', 'spiritual', 'surreal', 'suspenseful', 'tribal',
            'urban', 'warm', 'bright', 'storm', 'beach', 'hazy', 'mountains', 'cozy'
        ],
        Mood: [
            'angry', 'aggressive', 'anxious', 'bittersweet', 'calm', 'meditative',
            'disturbing', 'energetic', 'manic', 'happy', 'playful', 'lethargic',
            'longing', 'mellow', 'soothing', 'passionate', 'quirky', 'romantic',
            'sad', 'depressive', 'lonely', 'melancholic', 'sombre', 'sensual',
            'sentimental', 'uplifting', 'triumphant'
        ],


        Style: [
            'anthemic', 'atmospheric', 'atonal', 'avant-garde', 'chaotic', 'complex',
            'dense', 'dissonant', 'eclectic', 'heavy', 'lush', 'melodic', 'microtonal',
            'minimalistic', 'noisy', 'polyphonic', 'progressive', 'raw', 'repetitive',
            'rhythmic', 'soft', 'sparse', 'technical', 'polyrhythmic', 'theatrical',
            'bouncy', 'angular', 'maximalist', 'piercing', 'smooth', 'punchy', 'bassy',
            'crackly'
        ],

        Lyrics: [
            'lyrics', 'lyrical dissonance', 'narrative', 'stream of consciousness'
        ],

        Form: [
            'ballad', "children's music", 'lullaby',
            'nursery rhyme', 'concept album', 'ensemble',
            'a cappella', 'acoustic', 'androgynous vocals',
            'string quartet', 'choral', 'female vocalist', 'instrumental',
            'male vocalist', 'nonbinary vocalist', 'orchestral', 'vocal group',
            'hymn', 'jingle', 'medley', 'monologue',
            'novelty', 'opera', 'oratorio', 'parody', 'poem', 'section',
            'interlude', 'intro', 'movement', 'outro', 'reprise', 'silence',
            'skit', 'sonata', 'stem', 'suite', 'symphony', 'tone poem', 'waltz',
            'duet', 'diss', 'posse cut', 'pastiche', 'unaccompanied solo'
        ],
        Technique: [
            'composition', 'aleatory', 'generative music', 'improvisation',
            'uncommon time signatures', 'production', 'lobit', 'lo-fi', 'sampling',
            'Wall of Sound', 'through-composed', 'call and response', 'jamming',
            'free rhythm', 'triple metre', 'rubato', 'talk-singing', 'vocal chops',
            'harsh vocals', 'leitmotif'
        ]
    };

    function capitalizeDescriptor(descriptor) {
        const specialCases = {
            'lgbtq': 'LGBTQ',
            'stream of consciousness': 'Stream of Consciousness',
            'call and response': 'Call and Response',
            'djmix': 'DJ Mix',
            'unauth': 'Bootleg/Unauthorized'
        };

        const lowerDescriptor = descriptor.toLowerCase();
        if (specialCases[lowerDescriptor]) {
            return specialCases[lowerDescriptor];
        }
        return descriptor.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }

    function getReleaseType() {
        const typeRow = Array.from(document.querySelectorAll('tr'))
            .find(row => row.querySelector('th')?.innerText.trim() === 'Type');

        return typeRow ? typeRow.querySelector('td').innerText.trim().toLowerCase() : null;
    }

    function formatDescriptor(descriptor) {
        return descriptor.toLowerCase().replace(/\s+/g, '-');
    }

    function organizeDescriptors() {
        const descriptorsContainer = document.querySelector('.release_pri_descriptors');
        if (!descriptorsContainer) return;

        const descriptors = descriptorsContainer.innerText.split(', ').map(d => d.trim());
        const organized = {};

        for (const category in categories) {
            organized[category] = descriptors.filter(desc => categories[category].includes(desc))
                .map(desc => capitalizeDescriptor(desc));
        }

        const releaseType = getReleaseType();
        const typePrefixMap = {
            'album': 'album',
            'single': 'single',
            'mixtape': 'mixtape',
            'ep': 'ep',
            'dj mix': 'djmix',
            'music video': 'musicvideo',
            'video': 'video',
            'compilation': 'comp',
            'bootleg / unauthorized': 'unauth',
            'additional release': 'additional'
        };

        const typePrefix = typePrefixMap[releaseType] || null;

        const newContainer = document.createElement('div');
        newContainer.style.marginTop = '20px';
        newContainer.style.fontSize = '0.9em';

        const flexContainer = document.createElement('div');
        flexContainer.style.marginTop = '10px';
        flexContainer.style.marginBottom = '10px';
        flexContainer.style.display = 'flex';
        flexContainer.style.flexWrap = 'wrap';
        flexContainer.style.gap = '20px';
        flexContainer.style.fontSize = '0.9em';

        for (const category in organized) {
            if (organized[category].length > 0) {
                const categoryDiv = document.createElement('div');
                categoryDiv.style.flex = '1';
                categoryDiv.style.minWidth = '70px';
                categoryDiv.style.width = '120px';

                const categoryTitle = document.createElement('p');
                categoryTitle.innerText = category;
                categoryTitle.style.fontWeight = 'bold';
                categoryTitle.style.marginBottom = '8px';
                categoryDiv.appendChild(categoryTitle);

                const categoryList = document.createElement('ul');
                categoryList.style.listStyleType = 'none';
                categoryList.style.marginTop = '0';
                categoryList.style.paddingLeft = '0';
                organized[category].forEach(desc => {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    const formattedDesc = formatDescriptor(desc);
                    link.href = `https://rateyourmusic.com/charts/top/${typePrefix}/all-time/d:${formattedDesc}`;
                    link.target = '_blank';
                    link.innerText = desc;
                    link.style.textDecoration = 'none';
                    listItem.style.marginTop = '5px';
                    listItem.appendChild(link);
                    categoryList.appendChild(listItem);
                });

                categoryDiv.appendChild(categoryList);
                flexContainer.appendChild(categoryDiv);
            }
        }

        descriptorsContainer.parentNode.insertBefore(flexContainer, descriptorsContainer.nextSibling);
        descriptorsContainer.style.display = 'none';
    }

    organizeDescriptors();
})();