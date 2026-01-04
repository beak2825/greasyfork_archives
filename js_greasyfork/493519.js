// ==UserScript==
// @name         Auto Unpause Acellus
// @namespace    https://greasyfork.org/en/users/1291009
// @version      3.3
// @description  Unpauses videos, adds cool effects, dynamic tones, for fun interactions!
// @author       BadOrBest
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acellus.com
// @match        https://admin192c.acellus.com/student/*
// @grant        none
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM.registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/493519/Auto%20Unpause%20Acellus.user.js
// @updateURL https://update.greasyfork.org/scripts/493519/Auto%20Unpause%20Acellus.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let isTabFocused = true;
    let shouldTogglePlayer = true;
    let tabChangeCount = parseInt(localStorage.getItem('tabChangeCount')) || 0;
    let selectedTone = localStorage.getItem('selectedTone') || 'Studious'; // Default to Studious tone
    let isMonitoring = true; // Auto unpause is enabled by default
    let isVideoMode = false; // Detect if a video is on the page
    let lastMode = 'video, .plyr'; // Keep track of the last mode

    // Video Tones
    const videoTones = { "Excited": ["Hey there! Buckle up, your video is kicking off! 🎉", "Fantastic to see you! Let’s dive into this exciting video! 📽️", "Woohoo! You’re back! Your video is all set to play! 🍿", "Let’s get this show on the road! Your video is live! 🎬", "Oh wow! Great to have you! Your video is rolling! 🎥", "Yay! Time for your favorite video to shine! 🎊", "Welcome back! Your video is about to blow your mind! 🥳", "Surprise! Your video is here and ready to entertain! 🎡", "Boom! We’re jumping into the fun with this video! 🔥", "Awesome news! Your video is back on screen! 🎤", "Look at that! Your video is resuming! Get comfy! 📺", "Oh wow! You’re back just in time for the best part! 🎇", "Let’s go! The video is live again, and it’s epic! 🎦", "Your video is on! Get ready for an amazing experience! 🎞️", "Here we go! It’s time for your video to take the spotlight! 🎢", "We’re back! Ready for some thrilling video moments? 🎊", "Can’t wait! Your video is rolling and it’s going to be great! 🎠", "Get hyped! Your video is about to start! 📸", "It’s showtime! Let’s enjoy this fantastic video! 🎆", "Hey again! Here’s your favorite video back in action! 🍿", "Video time! Let’s enjoy this amazing content together! 🎤"], "Depressed": ["Ugh... you’re back... the video is still droning on... 😞", "Well, here we are again... the video continues... 📼", "Sigh... welcome back... the same video is playing again... 😔", "Oh... you’re back... I guess we’ll just watch this video... 😐", "Still here? Fine, let’s just get through this video... 😕", "Let’s just power through... 🎦", "You’re still watching this? Video’s on... 😩", "Why are we still doing this... 😓", "Here we go... just another moment of this video... 🥱", "Do we really have to do this? Just let it play... 😐", "Great... more video... just what I needed... 😑", "The video’s back... isn’t that exciting? 😔", "We’re still doing this? Fine, let’s watch... 😒", "Sigh... here comes the video... again... 😶", "Why does this feel like a loop? Playing video... 😔", "Oh no... not this again... 😩", "Guess it’s time for more of this... 😕", "Can we just end this? Nope? Fine... 😐", "Still here? Video’s on... 😕", "Not again... why are we doing this? 😩", "This video feels endless... 😣"], "Angry": ["Welcome back! The video’s still on, can you believe it? 😡", "Ugh, let’s just get this over with already... 😤", "Seriously? We’re still watching this? 😠", "Why is this still happening? The video is on... 😤", "Unbelievable! The same video again? Really? 😡", "Get ready... here comes the never-ending video... 😠", "This is so frustrating! Still stuck watching this? 😤", "What a waste of time! The video is still on! 🤬", "Can we just stop this video already? 😠", "Not again! Why is this video still here? 😡", "Why is this dragging on? Just play something new! 😤", "Great, more of this nonsense... 😡", "Why is this happening again? Just play something different! 🤬", "I’m done with this! Just play the video... 😤", "Here we go again! The same video... what a joke! 😠", "Oh, joy... more of this video... 😡", "Are you serious? This video is still playing? 😤", "Why do we have to keep watching? Enough already! 😠", "Another round of this? Ugh... just let it play! 😤", "Here we go again... video still on! 😡", "Why do we have to keep doing this? Just end it already! 😤"], "Studious": ["Welcome back! The educational video is now playing! 📚", "Great to see you! Your study video is here and ready! 🎓", "Hey! The learning video is rolling now! 📝", "Let’s dive into knowledge! Your video is playing! 🎥", "Back to studying! The video is live and waiting! 📖", "Good to have you back! Let’s get some learning done! 🔍", "Ready to learn something new? Your study video is playing! 🎉", "Welcome back! Time to focus on the study video! 📘", "Here we go! The educational content is rolling! 🎬", "Fantastic! Your study video is live now! 📚", "Awesome! Time to expand your mind! 🎓", "Let’s get back to it! The video is all about learning! 📖", "Great to see you! Ready for some knowledge? 🎥", "Let’s dive in! Your educational video is on! 📝", "Here we go! The study video is starting! 🎓", "Back to learning! Your video is playing now! 📚", "Awesome! Time for some serious study! 📘", "Let’s keep the momentum going! The video is rolling! 🎬", "Time to study! Your educational video is live! 🔍", "Great! The study session is now playing! 🎉", "Let’s jump into the video! Knowledge awaits! 📖"] };


    // Task (Question) Tones
    const taskTones = { "Excited": ["Let’s smash through these questions! 🎉", "Awesome! Ready to crush these tasks? 💪", "Let’s tackle this list like champs! 🚀", "Hooray! Time to dive into these challenges! 🎊", "Get pumped! We’re about to nail these questions! 🎈", "Fantastic! Let’s make progress together! 🌟", "Yay! It’s time to shine on these tasks! 🌈", "Let’s power through these questions! 🔥", "Super stoked to tackle this task list! ⚡", "Ready to own these questions? Let’s go! 💥", "Let’s get fired up for some problem-solving! 🎇", "Woohoo! Questions don’t stand a chance! 🏆", "Excited to tackle this head-on! 📈", "Let’s roll! Time for some serious task-busting! 🎢", "Yippee! We’re about to get things done! 📅", "Let’s make this happen! Tasks await! 🎤", "Can’t wait to dive into these questions! 🌊", "Let’s get to work! These tasks won’t do themselves! 🔨", "Here we go! Time to knock out these problems! ⏳", "Thrilled to be tackling these challenges! 🏋️‍♂️", "Ready, set, go! Let’s conquer this task list! 🥇"], "Depressed": ["Sigh... more questions to slog through... 😞", "Well, I guess we should get these questions done... 😔", "Ugh... here comes another round of questions... 😩", "Guess it’s time to plow through these tasks... 😐", "Why do these questions feel endless? 😓", "Just what I needed... more questions... 😒", "Can we please finish these already? 😔", "Here we go again... more questions await... 😞", "Sigh... let’s get this over with... 😶", "Do we really have to do this? 😔", "Another question? Sigh... 😔", "This feels like a never-ending cycle... 😩", "Great... just what I wanted... more questions... 😑", "Let’s just get through this... slowly... 😞", "Can we wrap this up? 😕", "More questions? Just my luck... 😔", "It’s like these tasks multiply... 😣", "Guess I’m stuck with more questions... 😩", "Why does this feel like a chore? 😕", "Ugh... can this just be done? 😔", "Sigh... trudging through these tasks... 😩"], "Angry": ["Ugh, these questions again? Seriously? 😡", "Why are we still doing these questions? 😠", "This is ridiculous! More questions? 😤", "Great, just what I wanted... more tasks... 😡", "Why won’t this end? Ugh! 😠", "Not this again! Why is it never-ending? 😤", "Can we just be done with this? 😡", "Seriously? More of this nonsense? 😤", "This is infuriating! Can we finish? 😡", "I can’t believe we’re still on this... 😠", "Another round? This is getting old! 😤", "Why do we have to keep going? 😡", "Ugh! More questions? Just let me out! 😠", "What a waste of time! Can we stop? 😤", "This is so frustrating! Just let it end! 😡", "Do we have to keep dragging this out? 😠", "Why won’t this just finish already? 😤", "More questions? This is a joke! 😡", "Not again! Let’s just get it over with! 😠", "This is beyond annoying! Enough! 😤"], "Studious": ["Let’s dive into these questions! 📚", "Great! Time to tackle these problems! 📝", "Ready to focus? Let’s solve these! 🎓", "Let’s get serious about these tasks! 🔍", "Time to hit the books with these questions! 📖", "Fantastic! Let’s make some progress! 📊", "Here we go! Time to learn and grow! 🎓", "Let’s sharpen our minds with these tasks! ✏️", "Let’s power through this study session! 📚", "Ready to conquer these educational challenges? 🎓", "Let’s buckle down and focus! 🧠", "Great! Time for some serious studying! 📘", "Let’s unlock knowledge with these questions! 🔑", "Here’s to productive learning ahead! 📚", "Ready for some brain exercise? Let’s go! 🧠", "Let’s keep our minds sharp with this study! 📖", "Fantastic! Let’s learn together! 🎓", "Time to expand our horizons! Let’s dive in! 🌍", "Let’s keep the focus strong! Knowledge awaits! 📚", "Ready to tackle this study session? Let’s do it! 🎓", "Let’s ace these questions together! 🏅"] };

    // Easter egg logic
    function handleEgg() {
        const eggs = [
"Dev log #01: I just realized my last commit message was 'oops.' That’s professional, right? 😅", "Dev log #02: Why do I keep forgetting semicolons? It’s like they’re playing hide and seek! 🤔", "Dev log #03: I tried to explain my code to my plant. It didn’t seem to understand. 🌱", "Dev log #04: Random Thought: If my code was a person, it would definitely be a drama queen! 🎭", "Dev log #05: I once accidentally pushed to the wrong branch. Who knew ‘master’ was so sensitive? 😳", "Dev log #06: Can we just agree that debugging is 90% coffee and 10% actual coding? ☕️", "Dev log #07: My code runs perfectly... until I hit 'run.' Then it’s a horror show. 🎬", "Dev log #08: Why do they call it 'rubber duck debugging'? I’m just here for the quacks! 🦆", "Dev log #09: I think my keyboard has a mind of its own. It definitely adds extra characters on purpose! ⌨️", "Dev log #10: I’m convinced my IDE has a vendetta against me. It just loves to crash! 💥", "Dev log #11: Every time I fix a bug, two more appear. It’s like a coding Hydra! 🐉", "Dev log #12: If I had a dollar for every time I misspelled a variable name, I could afford better coffee. 💸", "Dev log #13: Pro Tip: If it works, don’t touch it. That’s how you end up with a ‘works on my machine’ situation. 🛠️", "Dev log #14: My code is like a pizza: sometimes it’s just a little cheesy! 🍕", "Dev log #15: Every time I refactor, I end up with more spaghetti than code. 🍝", "Dev log #16: Is it just me, or does 'console.log' feel like a developer’s version of 'I love you'? 💖", "Dev log #17: I thought about using comments to communicate with my future self, but I might just leave riddles. 🕵️‍♂️", "Dev log #18: I once tried to fix a bug with a meme. Turns out, the humor didn’t compile. 😂", "Dev log #19: Did I mention my code runs great in my head? Reality checks are a whole different story! 🤯", "Dev log #20: I wonder if my laptop is secretly judging my coding skills... probably not wrong. 😬", "Dev log #21: Pro Tip: Always comment your code... unless you want future you to suffer! 📝", "Dev log #22: I think my code has mood swings. One moment it works, and the next it’s a complete disaster! 😱", "Dev log #23: I can't let the team know I secretly binge-watch coding tutorials instead of doing my own work. 🤐", "Dev log #24: Why does my code break only when I’m about to present it? It’s like it has stage fright! 🎤", "Dev log #25: I tried to teach my code how to be organized. It just laughed at me. 😂", "Dev log #26: Every time I think I’m done, there’s always a last-minute bug lurking around. 🕷️", "Dev log #27: I once spent more time debugging than actually coding. Who needs productivity, right? 🤷‍♂️", "Dev log #28: Why do they call it ‘version control’ when it feels more like a time machine? ⏳", "Dev log #29: I’m convinced my IDE has a sense of humor. It crashes right after I brag about my code! 😏", "Dev log #30: I wonder if other devs use ‘copy-paste’ as a love language too? ❤️", "Dev log #31: Sometimes I think my code is sentient... and it’s plotting against me. 🤖", "Dev log #32: Every time I see 'undefined,' I feel personally attacked. 😤", "Dev log #33: I think my keyboard has a crush on me; it never lets me type the right thing on the first try! 💔", "Dev log #34: If I had a penny for every error message I’ve seen, I could retire on a beach! 🏖️", "Dev log #35: My favorite programming language? The one that works without throwing exceptions! 🎉", "Dev log #36: Why do I feel like I’m in a relationship with my code? It’s complicated! 💔", "Dev log #37: I’m considering writing a book titled '101 Ways to Break Your Code.' Bestsellers, here I come! 📚", "Dev log #38: Did you know? The best way to debug is to stare blankly at the screen until it fixes itself. 🤷‍♀️", "Dev log #39: I should probably stop coding at midnight... but where’s the fun in that? 🌙", "Dev log #40: My code has a split personality: it works perfectly one minute, then completely fails the next! 😜", "Dev log #41: If coding was a sport, I’d still be in the amateur league... but at least I’m having fun! ⚽️", "Dev log #42: Why do I feel like my code is just one big inside joke? 🤪", "Dev log #43: I think my comments are more sarcastic than helpful. Future me is in for a treat! 🎭", "Dev log #44: I once tried to explain recursion to my friend. They’re still confused! 🔄", "Dev log #45: My goal this week: write clean code and not break anything... let’s see how that goes! 🧼", "Dev log #46: I should probably stop trying to debug while half asleep. It never ends well! 😴", "Dev log #47: If I had a superpower, it would be to find bugs before they find me! 🦸‍♂️", "Dev log #48: I wonder if my code feels neglected when I work on other projects? 🥺", "Dev log #49: Did I mention that my keyboard has seen more emotional breakdowns than my therapist? 🥴", "Dev log #50: I think my compiler is just messing with me. It loves to throw unexpected errors! ⚡️", "Dev log #51: I once wrote a comment that said ‘TODO: Fix this’... future me is not amused! 🤔", "Dev log #52: I’m convinced my code has a vendetta against clear naming conventions. 🏴‍☠️", "Dev log #53: Random Thought: If I ever get a cat, I’m naming it ‘404’ because it will be ‘not found’ all the time! 🐱", "Dev log #54: I just found a bug I thought I fixed last week. Surprise! 🎉", "Dev log #55: Why do I feel like my error messages are judging me? 🙈", "Dev log #56: I once spent an hour trying to fix a typo. It was a real page-turner! 📖", "Dev log #57: My code is like an onion; it has layers, and sometimes it makes me cry! 🧅", "Dev log #58: I’m starting to think my code is just a collection of memes at this point. 😂", "Dev log #59: I’ve considered adding a ‘panic’ button to my code for emergencies... 🤯", "Dev log #60: If I could trade my debugging skills for snacks, I’d be the richest developer! 🍿", "Dev log #61: Did you know? Every time I change something in my code, a developer somewhere cries. 😢", "Dev log #62: I once named a variable ‘temp’ just to make my code more dramatic. 🌡️", "Dev log #63: Why do I always find typos right after I submit? It’s like my code has a sixth sense! 👀", "Dev log #64: I keep wondering if my keyboard is secretly a magician. It loves to make letters disappear! 🎩", "Dev log #65: I think my code has more plot twists than a Netflix series! 🍿", "Dev log #66: I’m pretty sure my IDE is just messing with me at this point... 😜", "Dev log #67: Random Thought: If my code were a movie, it would be a comedy of errors! 🎬", "Dev log #68: I once tried to fix a bug by looking at it angrily... it didn’t work. 😡", "Dev log #69: I think my code is playing hard to get. The more I try to fix it, the worse it gets! 🙃", "Dev log #70: If I had a magic wand, I’d use it to make all bugs disappear! ✨", "Dev log #71: My code has officially been declared ‘quirky.’ At least it has character! 😜", "Dev log #72: Did I mention I’m currently in a love-hate relationship with my IDE? ❤️💔", "Dev log #73: Every time I see a 'syntax error,' I feel like my code is throwing shade. 🌞", "Dev log #74: My favorite debugging method? Yelling at the screen until it fixes itself! 📺", "Dev log #75: Why do I feel like my code is just a series of bad decisions? 🤷‍♂️", "Dev log #76: I’m convinced there’s a bug in my code that I’m just too scared to find! 👻", "Dev log #77: I keep telling myself I’ll start writing better comments... tomorrow! 🗓️", "Dev log #78: Today’s mission: avoid my code exploding... wish me luck! 💥", "Dev log #79: Did you know? The first step in debugging is always to take a deep breath. 🧘‍♂️", "Dev log #80: I think I need a vacation... from my own code! 🏖️", "Dev log #81: If coding was an Olympic sport, I’d definitely get a participation medal! 🏅", "Dev log #82: I keep asking myself: what would a better programmer do? Probably not this! 🤔", "Dev log #83: I wonder if my code has a dark side... it definitely has a few skeletons! 💀", "Dev log #84: I’m pretty sure my IDE is just a portal to another dimension... it definitely feels that way! 🌌", "Dev log #85: Random Thought: If my code were a movie, it would be a comedy of errors! 🎬", "Dev log #86: I once tried to fix a bug by looking at it angrily... it didn’t work. 😡", "Dev log #87: I think my code is playing hard to get. The more I try to fix it, the worse it gets! 🙃", "Dev log #88: If I had a magic wand, I’d use it to make all bugs disappear! ✨", "Dev log #89: Who thought Easter eggs were a good idea at 2 AM? 😳", "Dev log #90: My code has officially been declared ‘quirky.’ At least it has character! 😜", "Dev log #91: Debugging is like being a detective in a crime movie where you’re also the murderer. 🕵️‍♂️", "Dev log #92: I accidentally commented out my own jokes. Now they're just silent! 🤐", "Dev log #93: I think I need a vacation... from my own code! 🏖️", "Dev log #94: I’m convinced there’s a bug in my code that I’m just too scared to find! 👻", "Dev log #95: I keep telling myself I’ll start writing better comments... tomorrow! 🗓️", "Dev log #96: My code runs perfectly... until I hit 'run.' Then it’s a horror show. 🎬", "Dev log #97: My IDE has a tendency to crash right when I’m about to save. It’s got perfect timing! ⏰", "Dev log #98: If I had a nickel for every typo, I could buy a lifetime supply of coffee! ☕️", "Dev log #99: My code is like an onion; it has layers, and sometimes it makes me cry! 🧅", "Dev log #100: If coding were a sport, I’d definitely get a participation medal! 🏅"
        ];
    const now = Date.now(); // Current timestamp
    const tenHours = 10 * 60 * 60 * 1000; // 10 hours in milliseconds

    // Helper function to get available eggs
    function getAvailableEggs() {
        return eggs.filter((egg, index) => {
            const lastEggTime = parseInt(localStorage.getItem(`egg_${index}_lastShown`)) || 0;
            return (now - lastEggTime) >= tenHours;
        });
    }

    // Try to get available eggs
    let availableEggs = getAvailableEggs();

    // If no available eggs and a blank would be served
    if (availableEggs.length === 0) {
        console.log("No Easter eggs available, resetting cooldowns.");

        // Reset the last shown time for all eggs
        eggs.forEach((egg, index) => {
            localStorage.setItem(`egg_${index}_lastShown`, now - tenHours); // Reset by setting time far back
        });

        // Retry to get available eggs
        availableEggs = getAvailableEggs();
    }

    // Select a random available egg
    const randomIndex = Math.floor(Math.random() * availableEggs.length);
    const selectedEgg = availableEggs[randomIndex];

    // Store the current time as the last shown time for this egg
    const eggIndex = eggs.indexOf(selectedEgg);
    localStorage.setItem(`egg_${eggIndex}_lastShown`, now);

    return selectedEgg;
}

function triggerEgg(eggChance) {
    if (Math.random() < eggChance) {
        const easterEggText = document.createElement('p');
        easterEggText.textContent = handleEgg();
        easterEggText.style.color = '#8B0000';
        easterEggText.style.fontSize = '12px';
        easterEggText.style.fontStyle = 'bold';

        return easterEggText ? easterEggText : null;
    }
    return null;
}

    // Dynamic function to get the correct greeting based on the mode
function getRandomGreeting() {
    const tones = isVideoMode ? videoTones : taskTones;
    const now = Date.now();
    const tenHours = 10 * 60 * 60 * 1000; // 10 hours in milliseconds

    // Helper function to get available greetings
    function getAvailableGreetings() {
        return tones[selectedTone].filter((message, index) => {
            const lastGreetingTime = parseInt(localStorage.getItem(`greeting_${selectedTone}_${index}_lastShown`)) || 0;
            return (now - lastGreetingTime) >= tenHours;
        });
    }

    // Try to get available greetings
    let availableGreetings = getAvailableGreetings();

    // If no available greetings and a blank would be served
    if (availableGreetings.length === 0) {
        console.log("No greetings available, resetting cooldowns.");

        // Reset the last shown time for all greetings
        tones[selectedTone].forEach((message, index) => {
            localStorage.setItem(`greeting_${selectedTone}_${index}_lastShown`, now - tenHours); // Reset by setting time far back
        });

        // Retry to get available greetings
        availableGreetings = getAvailableGreetings();
    }

    // Select a random available greeting
    const randomIndex = Math.floor(Math.random() * availableGreetings.length);
    const selectedGreeting = availableGreetings[randomIndex];

    // Store the current time as the last shown time for this greeting
    const greetingIndex = tones[selectedTone].indexOf(selectedGreeting);
    localStorage.setItem(`greeting_${selectedTone}_${greetingIndex}_lastShown`, now);

    return selectedGreeting;
}


    function showToneSelectionGUI() {
        const toneGUI = document.createElement('div');
        toneGUI.id = 'toneSelectionGUI';
        toneGUI.style = `
            position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%);
            background-color: #fff; border: 2px solid #007bff; padding: 20px;
            border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            z-index: 10000; text-align: center; color: #333; opacity: 0;
            transition: opacity 0.5s ease-out;
        `;

        const title = document.createElement('p');
        title.textContent = "Select Your Preferred Tone or Disable Messages";
        title.style.color = '#007bff';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '10px';
        toneGUI.appendChild(title);

        const toneOptions = ["Excited", "Depressed", "Angry", "Studious", "No Messages"];
        toneOptions.forEach(tone => {
            const button = document.createElement('button');
            button.textContent = tone;
            button.style = 'margin: 5px; padding: 10px 15px; border-radius: 5px; border: none; background-color: #007bff; color: #fff; cursor: pointer;';
            button.onclick = function() {
                selectedTone = (tone === 'No Messages') ? null : tone;
                localStorage.setItem('selectedTone', selectedTone);
                document.body.removeChild(toneGUI);
            };
            toneGUI.appendChild(button);
        });

        document.body.appendChild(toneGUI);
        setTimeout(() => toneGUI.style.opacity = '1', 100);
    }

    function showWelcomeBackGUI() {
        if (!selectedTone) return;

        tabChangeCount++;
        localStorage.setItem('tabChangeCount', tabChangeCount);

        const existingGUI = document.getElementById('welcomeBackGUI');
        if (existingGUI) existingGUI.remove();

        const welcomeBackGUI = document.createElement('div');
        welcomeBackGUI.id = 'welcomeBackGUI';
        welcomeBackGUI.style = `
            position: fixed; top: 10%; right: 20px; background-color: #fff;
            border: 2px solid #007bff; padding: 15px; border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); z-index: 10000;
            text-align: center; color: #333; opacity: 0;
            transition: opacity 0.5s ease-out, transform 0.5s ease-in-out;
            cursor: pointer; transform: translateX(100px);
        `;

        const greetingText = document.createElement('p');
        greetingText.textContent = getRandomGreeting();
        greetingText.style.color = '#007bff';
        greetingText.style.fontWeight = 'bold';
        welcomeBackGUI.appendChild(greetingText);


        const eggMessage = triggerEgg(0.15); // 10% chance to show an *^'
        if (eggMessage) {
            welcomeBackGUI.appendChild(eggMessage);
        }

        welcomeBackGUI.onclick = function() {
            welcomeBackGUI.style.opacity = '0';
            setTimeout(() => document.body.removeChild(welcomeBackGUI), 500);
        };

        setTimeout(() => {
            welcomeBackGUI.style.opacity = '0';
            setTimeout(() => document.body.removeChild(welcomeBackGUI), 500);
        }, 6500);

        document.body.appendChild(welcomeBackGUI);
        setTimeout(() => {
            welcomeBackGUI.style.opacity = '1';
            welcomeBackGUI.style.transform = 'translateX(0)';
        }, 100);
    }

    // Function to force unpause all media elements (videos, audios)
    function unpauseMedia(mediaElements) {
        mediaElements.forEach(mediaElement => {
            if (mediaElement.paused && !mediaElement.getAttribute('data-user-paused')) {
                mediaElement.play().catch(error => {
                    console.error('Error attempting to unpause media:', error);
                });
            }
        });
    }

    // Handle visibility change (tab switching)
    function handleVisibilityChange() {
        const mediaElements = document.querySelectorAll('video, audio, .plyr');
        if (document.hidden) {
            // When tab is not focused (hidden), force unpause
            unpauseMedia(mediaElements);
        }
    }

    // Add animations for media pause/play effect
    function addVideoAnimations() {
        const mediaElements = document.querySelectorAll('video, audio, .plyr');

        mediaElements.forEach(mediaElement => {
            mediaElement.addEventListener('pause', () => {
                // New zoom-out effect without physically changing the size
                mediaElement.style.transition = 'transform 0.3s ease, filter 0.3s ease';
                mediaElement.style.transform = 'perspective(1000px) translateZ(+50px)'; // Zoom out illusion
                mediaElement.style.filter = 'grayscale(100%)';
                mediaElement.style.transformOrigin = 'center'; // Keep the zoom centered
            });

            mediaElement.addEventListener('play', () => {
                mediaElement.style.transform = 'perspective(1000px) translateZ(0)'; // Reset back to normal
                mediaElement.style.filter = 'grayscale(0%)';
            });
        });
    }

// Function to detect video mode
function detectVideoMode() {
    const videoElements = document.querySelectorAll('video, audio, .plyr');
    let isVideoVisible = false;

    videoElements.forEach(videoElement => {
        const rect = videoElement.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0 && window.getComputedStyle(videoElement).visibility !== 'hidden';

        // Check if the video element is visible and playable
        if (isVisible && videoElement.readyState >= 1) {
            isVideoVisible = true;
        }
    });

    if (isVideoVisible && lastMode !== 'video, .plyr') {
        isVideoMode = true;
        lastMode = 'video, .plyr';  // Set lastMode to 'video' (not 'video, audio, .plyr')
        console.log('Switched to Video Mode');
    } else if (!isVideoVisible && lastMode !== 'task') {
        isVideoMode = false;
        lastMode = 'task';   // Set lastMode to 'task'
        console.log('Switched to Task Mode');
    }
}

// Start monitoring tab changes
const monitoringInterval = setInterval(() => {
    if (isMonitoring) {
        handleVisibilityChange();  // Ensure media is unpaused when tab is hidden
        detectVideoMode();         // Check if video mode or task mode
        addVideoAnimations();      // Ensure animations are added
    }
}, 0.01); // Check every second


    // Register menu commands
    GM.registerMenuCommand("Change Message Tone", showToneSelectionGUI);
    GM.registerMenuCommand("Toggle Auto Unpause", () => {
        isMonitoring = !isMonitoring;
        alert(`Auto Unpauser is now ${isMonitoring ? "enabled" : "disabled"}.`);
    });

    // Event listeners for visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', () => {
        isTabFocused = true;
        showWelcomeBackGUI();
    });
    window.addEventListener('blur', () => isTabFocused = false);

    // Daily reset logic
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toISOString().slice(0, 10);
    if (lastVisit !== today) {
        localStorage.setItem('tabChangeCount', '0');
        localStorage.setItem('lastVisit', today);
    }
})();
