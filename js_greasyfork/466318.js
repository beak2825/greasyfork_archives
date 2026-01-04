// ==UserScript==
// @name         Profilerv0.9
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  A script to listen to chat messages and respond to a specific prefix
// @author       BadNintendo
// @match        https://www.shutdown.chat/*/*
// @license MIT
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/466318/Profilerv09.user.js
// @updateURL https://update.greasyfork.org/scripts/466318/Profilerv09.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const prefix = '!';
    const enableCommands = true;
    const enableGames = true;
    const enableGreet = false;

    const chatbox = document.querySelector('.chatbox');
    if (!chatbox) {
        console.error('Chatbox not found');
        return;
    }

    const inputArea = document.querySelector('.chatmsg');
    if (!inputArea) {
        console.error('Input area not found');
        return;
    }
    const self = document.querySelector('#profile p').textContent.trim().toLowerCase();

    const eightBallResponses = [
		'It is certain', 'It is decidedly so', 'Without a doubt', 'Yes, definitely',
		'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good',
		'Yes', 'Signs point to yes', 'Reply hazy, try again', 'Better not tell you now',
		'Ask again later', 'Cannot predict now', 'Concentrate and ask again', 'Don’t count on it',
		'Outlook not so good', 'My sources say no', 'Very doubtful', 'My reply is no'
	];

	const yesNoResponses = [
		'🔮 Absolutely! Don\'t even think twice. 🎉',
		'🔮 It is decidedly so. 🌟',
		'🔮 Without a doubt, yes! 💯',
		'🔮 Yes, definitely. You\'ve got this! 💪',
		'🔮 Most likely, but take it with a grain of salt. 🧂',
		'🔮 I wouldn\'t count on it. 😔',
		'🔮 Outlook not so good. 🙈',
		'🔮 My sources say no. Sorry! 💔',
		'🔮 Very doubtful, but miracles do happen! 🙏',
		'🔮 My reply is no. Chin up, though! 😊',
		'🔮 Signs point to yes. Get excited! 🥳',
	    '🔮 The stars align in your favor. Go for it! 🌠',
	    '🔮 My intuition says yes. Trust it! 🧘',
	    '🔮 Outlook seems doubtful. Be cautious! 🚧',
	    '🔮 I sense a strong no. Be careful! 🛑'
	];

	const whenResponses = [
		'🔮 It\'s going to happen soon. Be patient! ⏳',
		'🔮 In a while. Timing is everything! 🕰',
		'🔮 Later. Patience is a virtue. ⌛',
		'🔮 In the near future. Keep striving! 🚀',
		'🔮 It could be awhile, but it will be worth the wait. 🌈',
		'🔮 Sooner than you think. Anticipate! ⏲',
		'🔮 When the stars align. Keep your eyes peeled! 🌌',
		'🔮 Not anytime soon. Breathe and let go. 🍃',
		'🔮 At the perfect time. Trust the process! ⏱'
	];

	const howResponses = [
		'🔮 In a surprising way. Brace yourself! 😲',
		'🔮 With a little bit of effort. You can do it! 💪',
		'🔮 It will happen easily. Relax and let it be. 😎',
		'🔮 It\'s going to be a bit difficult. But you\'re tougher than you think! 💼',
		'🔮 By being persistent and dedicated. 🏋️',
		'🔮 Through unexpected pathways. Stay open! 🚪',
		'🔮 With a sprinkle of luck and a dash of hard work. 🎲',
		'🔮 Through a twist of fate. Be ready! 🌀',
		'🔮 It may require some sacrifice. Be brave! 🦁'
	];

	const unknownResponses = [
		'🔮 The reply is hazy, try again. 🌫',
		'🔮 It\'s better not to tell you now. Suspense! 😅',
		'🔮 I can\'t predict now. The future is a mystery. 🕵️',
		'🔮 Concentrate and ask again. Your focus needs more focus! 🧘',
		'🔮 The cosmos is silent. Try another question. 🌌',
		'🔮 My powers need recharging. Ask again later. 🔋',
		'🔮 The answer is obscured in the mists of time. Retry! ⏳',
		'🔮 Unforeseen forces prevent a clear answer. Reflect and ask again. 🤔',
		  '🔮 The stars are not aligned for an answer. 🌟',
		  '🔮 The oracle needs a coffee break. Try again later! ☕️',
		  '🔮 Even the universe doesn’t know everything. 🌌',
		  '🔮 The crystal ball fell asleep. Wake it up with another question! 💤',
		  '🔮 My magic senses are on vacation. Ask again soon! 🌴',
		  '🔮 Your question has created a disturbance in the force. Please rephrase. 🌊',
		  '🔮 The spirits are busy arguing about your question. Try again! 👻',
		  '🔮 Your question broke the matrix. Please reboot and ask again. 💻',
		  '🔮 The cosmic gears are still turning on that one. Please wait. 🪐',
		  '🔮 Your question has gone where no question has gone before. Please try again. 🚀',
		  '🔮 My psychic powers are experiencing technical difficulties. Please ask again later. 🛠️',
		  '🔮 Your question has been swallowed by a black hole. Please ask another. 🕳️',
		  '🔮 My crystal ball is buffering. Please ask again. 🔄',
		  '🔮 The universe is contemplating your question. It needs more time. ⌛',
		  '🔮 Your question has taken a detour through a wormhole. Please ask again. 🌀',
		  '🔮 Your question has been abducted by aliens. Please ask another. 👽'
		];

	const greetings = [
		'Hello', 'Hi', 'Hey', 'Greetings', 'Salutations', 'Yo', 'What’s up', 'Howdy', 'Sup',
		'Ahoy', 'Hi there', 'Good day', 'Bonjour', 'Hola', 'Ciao', 'Namaste', 'Salaam',
		'Konichiwa', 'G’day', 'Cheers', 'Top of the morning to you', 'Hello there',
		'Wassup', 'High', 'Hey there!', 'Hiya!', 'Good morning!', 'Good afternoon!',
		'Good evening!', 'Howdy partner!', 'What’s new?', 'What’s happening?', 'What’s going on?',
		'How are you doing?', 'What’s cooking?', 'How’s everything?', 'How’s life treating you?',
		'What’s the good word?', 'How goes it?', 'Hey hey!', 'How are things?', 'How’s your day?',
		'How’s your week?', 'How’s your month?', 'How’s your year?', 'How’s your life?',
		'What’s the deal?', 'What’s the story?', 'What’s the news?', 'What’s the gossip?'
	];

	const behaviorCategories = {
	  positive: ['good', 'great', 'awesome', 'yes', 'like', 'cool', 'sweet', 'nice', 'sick', 'amazing', 'fantastic', 'excellent', 'love', 'positive', 'excited', 'happy', 'joy', 'haha', 'lol', 'rofl', 'lmao', 'fun', 'win', 'victory', 'yay', 'yup', 'right', 'correct', 'agree', 'thanks', 'thank you', 'appreciate', 'perfect', 'beautiful', 'lovely', 'best','stoked', 'rad', 'lit', 'on point', 'fire', 'dope', 'legit', 'solid', 'stellar', 'rocking', 'ace', 'tight', 'top-notch', 'clutch', 'pumped', 'banging', 'killin it', 'crushing it', 'nailed it', 'nailed it', 'on fleek', 'boss', 'beast', 'gassed', 'wicked', 'savage', 'gnarly', 'epic', 'baller', 'prime', 'golden', 'mint', 'chill', 'breezy', 'hyped', 'score', 'bingo', 'jackpot', 'smashing', 'kickass', 'bomb', 'booming', 'banging'],
	  negative: ['bad', 'terrible', 'no', 'not', 'dislike', 'awful', 'horrible', 'sad', 'angry', 'upset', 'hate', 'negative', 'annoyed', 'frustrated', 'wrong', 'incorrect', 'disagree', 'nah', 'nope', 'ugh', 'meh', 'worse', 'worst', 'ugly', 'disappointed', 'hurt', 'pain', 'suck', 'fail', 'loss','lame', 'trash', 'garbage', 'weak', 'busted', 'flop', 'messed up', 'screwed up', 'botched', 'flunked', 'dissed', 'sucks', 'blows', 'bogus', 'foul', 'iffy', 'janky', 'naff', 'pants', 'rubbish', 'sketchy', 'spotty', 'sucky', 'wonky', 'yucky', 'crappy', 'bummer', 'downer', 'drag', 'raw deal', 'slap in the face', 'sore point', 'stinker', 'bummed', 'pissed', 'miffed', 'irked', 'fuming', 'steamed', 'cheesed off', 'ticked off', 'salty', 'sour'],
	  neutral: ['maybe', 'ok', 'fine', 'meh', 'alright', 'so-so', 'average', 'middle', 'neutral', 'idk', 'not sure', 'unsure', 'perhaps', 'could be', 'not bad', 'not good', 'mediocre', 'generally', 'usually', 'typically', 'kind of', 'sort of', 'okay','meh', 'whatever', 'fair', 'decent', 'middle-of-the-road', 'vanilla', 'plain', 'so-so', 'run-of-the-mill', 'standard', 'typical', 'common', 'regular', 'normal', 'ordinary', 'unremarkable', 'undistinguished', 'garden-variety', 'not bad', 'not great', 'nothing special', 'not up to much', 'nothing to write home about', 'bland', 'blah', 'humdrum', 'beige', 'generic', 'bog-standard', 'middling', 'passable', 'tolerable', 'adequate', 'satisfactory', 'acceptable', 'all right', 'fair-to-middling', 'no great shakes', 'not so hot', 'OK'],
	};
    const handleUserJoin = (node) => {
        const userJoinElement = node.querySelector('.sysmsg.fcsys.menuable');
        if (userJoinElement) {
            const joinText = userJoinElement.textContent;
            const joinedMatch = joinText.match(/(.+) has joined the room/);
            if (joinedMatch && enableGreet) {
                const username = joinedMatch[1];
                greetUserOnJoin(username);
            }
        }
    };

    const sendChatMessage = (message) => {
        if (inputArea.value === '' || inputArea.value === null) {
            const checkInterval = setInterval(() => {
                if (inputArea.value === '') {
                    clearInterval(checkInterval);
                    inputArea.value = message;
                    inputArea.focus();
                    setTimeout(() => {
                        const sendButton = document.querySelector('.sendbtn');
                        if (sendButton) {
                            sendButton.click();
                        } else {
                            console.error('Send button not found');
                        }
                    }, 200);
                }
            }, 500);
        }
    };

	const handleEightBallQuestion = ({ username, message }) => {
		if (message.startsWith(`${prefix}8ball`)) {
			const question = message.slice(`${prefix}8ball`.length).trim();
			let responses;

			if (question.toLowerCase().startsWith('will') || question.toLowerCase().includes(' or ')) {
				responses = yesNoResponses;
			} else if (question.toLowerCase().startsWith('when')) {
				responses = whenResponses;
			} else if (question.toLowerCase().startsWith('how')) {
				responses = howResponses;
			} else {
				responses = unknownResponses;
			}

			const randomResponseIndex = Math.floor(Math.random() * responses.length);
			const response = responses[randomResponseIndex];

			if (username === self) {
				console.log(response);
			} else {
				sendChatMessage(response);
			}
		}
	};

    const processMessageAndGreet = ({ username, message }) => {
        const cleanedUsername = username.replace(/[\s\W]+/g, '');
        console.log(`Processing message from ${username}: ${message}`);
        if (message.startsWith(prefix)) {
            const command = message.slice(1);
            if (enableCommands && enableGames) {
                handleEightBallQuestion({ username, message });
            }
            if (command === 'hello' && cleanedUsername !== self && enableCommands) {
                const randomIndex = Math.floor(Math.random() * greetings.length);
                sendChatMessage(`${greetings[randomIndex]}, ${cleanedUsername}!`);
            }
        }
    };

    const greetUserOnJoin = (username) => {
	  if (username !== self) {
		const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
		sendChatMessage(`${randomGreeting}, ${username}!`);
	  }
	};

	function changeColorBasedOnProfile(username, node) {
	  let profile = userProfiles[username];
	  if (!profile) return;

	  let behavior = 'neutral';
	  if (profile.positive > profile.negative) {
		behavior = 'positive';
	  } else if (profile.negative > profile.positive) {
		behavior = 'negative';
	  }

	  // Change color based on behavior
	  switch (behavior) {
		case 'positive':
		  node.querySelector(".ts").style.color = "green";
		  break;
		case 'negative':
		  node.querySelector(".ts").style.color = "red";
		  break;
		case 'neutral':
		  node.querySelector(".ts").style.color = "grey";
		  break;
	  }
	}

	const observer = new MutationObserver((mutations) => {
	  mutations.forEach(({ addedNodes }) => {
		addedNodes.forEach((node) => {
		  if (node.tagName === 'P') {
			const { username, message } = getMessageInfo(node);
			if (username && message) {
			  handleAllMessages({ username, message });
			  processMessageAndGreet({ username, message });
			  changeColorBasedOnProfile(username, node);
			}
		  }
		});
	  });
	});


	const getMessageInfo = (node) => {
	  const username = node.querySelector('.nm')?.textContent.trim();
	  const message = node.querySelector('.msg')?.textContent.trim();
	  return { username, message };
	};

	let userProfiles = {};

	function updateUserProfile(username, category, wordLength) {
	  if (!userProfiles[username]) {
		userProfiles[username] = {
		  positive: 0,
		  negative: 0,
		  neutral: 0,
		  totalWords: 0,
		  totalWordLength: 0,
		  averageWordLength: 0,
		};
	  }
	  userProfiles[username][category]++;
	  userProfiles[username].totalWords += 1;
	  userProfiles[username].totalWordLength += wordLength;
	  userProfiles[username].averageWordLength = userProfiles[username].totalWordLength / userProfiles[username].totalWords;
	  console.log(`User ${username} has a new ${category} message. Updated profile:`, userProfiles[username]);
	}


	function getBehaviorCategory(word) {
	  word = word.toLowerCase();
	  for (let category in behaviorCategories) {
		if (behaviorCategories[category].includes(word)) {
		  return category;
		}
	  }
	  return 'neutral';
	}

	let processedMessages = new Set();

	function handleAllMessages({ username, message }) {
	  if (processedMessages.has(message)) {
		return;
	  }
	  processedMessages.add(message);

	  let words = message.split(' ');
	  let categories = words.map(word => getBehaviorCategory(word));
	  let categoryCounts = categories.reduce((counts, category) => {
		counts[category] = (counts[category] || 0) + 1;
		return counts;
	  }, {});

	  let mostCommonCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0];
	  let averageWordLength = words.reduce((totalLength, word) => totalLength + word.length, 0) / words.length;

	  updateUserProfile(username, mostCommonCategory, averageWordLength);
	}

	observer.observe(chatbox, {
	  childList: true,
	  subtree: true,
	  characterData: true
	});
})();