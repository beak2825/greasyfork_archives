// ==UserScript==
// @name         GameChangerv2.2
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  A script to listen to chat messages and respond to a specific prefix
// @author       BadNintendo
// @match        https://www.shutdown.chat/*/*
// @license      MIT
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/466593/GameChangerv22.user.js
// @updateURL https://update.greasyfork.org/scripts/466593/GameChangerv22.meta.js
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

	let wouldYouRatherQuestions = [
	  "Would you rather be invisible or be able to fly?",
	  "Would you rather be rich or be famous?",
	  "Would you rather have a rewind button in your life or have a pause button in your life?",
	  "Would you rather always have to say everything on your mind or never speak again?",
	  "Would you rather fight one horse-sized duck or 100 duck-sized horses?",
	  "Would you rather have legs as long as your fingers or fingers as long as your legs?",
	  "Would you rather sweat cheese or always smell like a skunk?",
	  "Would you rather only be able to whisper or only be able to shout?",
	  "Would you rather have a pet dinosaur or a pet dragon?",
	  "Would you rather have a nose that grows when you lie, like Pinocchio, or ears that turn red when you're embarrassed?",
	  "Would you rather have a permanent clown face or permanent clown clothes?",
	  "Would you rather have a unicorn horn or a squirrel tail?",
	  "Would you rather only be able to eat food that's too hot or too cold?",
	  "Would you rather always have to sing rather than speak or dance everywhere you go?",
	  "Would you rather have hiccups for the rest of your life or feel like you need to sneeze but not be able to for the rest of your life?",
	  "Would you rather be a chicken that can talk or a monkey that can do sign language?",
	  "Would you rather have a head the size of a watermelon or the size of a tennis ball?",
	  "Would you rather always have to wear clown shoes or a clown wig?",
	  "Would you rather have more time or more money?",
	  "Would you rather always be 10 minutes late or always be 20 minutes early?",
	  "Would you rather have free Wi-Fi wherever you go or be able to drink unlimited free coffee at any coffee shop?",
	  "Would you rather lose all of your teeth or all of your hair?",
	  "Would you rather have to sit all day or stand all day?",
	  "Would you rather be able to teleport anywhere or be able to read minds?",
	  "Would you rather always be surrounded by annoying people or be alone for the rest of your life?",
	  "Would you rather always have to tell the truth or always lie?",
	  "Would you rather be the funniest person in the room or the most intelligent?",
	  "Would you rather live without the internet or live without air conditioning and heating?",
	  "Would you rather never have to clean a bathroom again or never have to do dishes again?",
	  "Would you rather be able to fly or breathe underwater?",
	  "Would you rather live in a cave or live in a treehouse?",
	  "Would you rather have to announce to everyone around you whenever you have to fart or pee your pants daily?",
	  "Would you rather be completely invisible for one day or be able to fly for one day?",
	  "Would you rather have a 10-hour dinner with a headstrong politician from an opposing party, or attend a 10-hour concert for a music group you detest?",
	  "Would you rather live at the top of a tall NYC apartment building or at the top of a mountain?",
	  "Would you rather spend the rest of your life with a sailboat as your home or an RV as your home?",
	  "Would you rather give up watching TV/movies for a year or give up playing games for a year?",
	  "Would you rather always be able to see 5 minutes into the future or always be able to see 100 years into the future?",
	  "Would you rather be an average person in the present or a king of a large country 2500 years ago?",
	  "Would you rather have whatever you are thinking to appear above your head for everyone to see or have absolutely everything you do live-streamed for anyone to see?",
	  "Would you rather wake up as a new random person every year and have full control of them for the whole year or once a week spend a day inside a stranger without having any control of them?",
	  "Would you rather live until you are 200 but look like you are 200 the whole time even though you are healthy or look like you are 25 all the way until you die at age 65?",
	  "Would you rather have unlimited international first-class tickets or never have to pay for food at restaurants?",
	  "Would you rather see what was behind every closed door or be able to guess the combination of every safe on the first try?",
	  "Would you rather be an average person in the present or a king of a large country 2500 years ago?",
	  "Would you rather have a golden voice or a silver tongue?",
	  "Would you rather sell all of your possessions or sell one of your organs?",
	  "Would you rather never have to work again or never have to sleep again (you won’t feel tired or suffer negative health effects)?",
	  "Would you rather be beautiful/handsome but stupid, or intelligent but ugly?"
	];


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
	    '🔮 I sense a strong no. Be careful! 🛑',
	    '🔮 The planets are aligning in your favor. The answer is yes! 🪐',
		'🔮 The spirits are giving a thumbs up. It\'s a yes! 👍',
		'🔮 The cosmic winds are blowing towards a yes. 🌬️',
		'🔮 The tea leaves spell out a yes. Enjoy your cup! 🍵',
		'🔮 It\'s written in the stars. A resounding yes! ✨',
		'🔮 The crystal ball is glowing. That\'s a yes! 🔮',
		'🔮 The cosmos whispers a yes. Listen closely! 🌌',
		'🔮 The astral plane points towards a yes. 🛸',
		'🔮 It\'s as likely as a unicorn sighting. So, no. 🦄',
		'🔮 The spirits are shaking their heads. It\'s a no. 👎',
		'🔮 My crystal ball is cloudy. It\'s a no. ☁️',
		'🔮 The tea leaves spell out a no. Bitter, but true. 🍵',
		'🔮 The cosmic winds are blowing towards a no. 🌬️',
		'🔮 The stars are giving a thumbs down. That\'s a no. 🌟',
		'🔮 The astral plane points towards a no. 🛸'
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
		'🔮 At the perfect time. Trust the process! ⏱',
	    '🔮 When the sun rises in the west. Expect the unexpected! 🌅',
		'🔮 At the stroke of midnight. Be ready for magic! 🕛',
		'🔮 When the moon is at its fullest. Keep an eye on the sky! 🌕',
		'🔮 At the crack of dawn. Rise and shine! 🌞',
		'🔮 When the cows come home. Patience is key! 🐄',
		'🔮 When you least expect it. Stay surprised! 😲',
		'🔮 When the planets are in harmony. Balance is crucial! 🪐',
		'🔮 When you stop watching the clock. Time will tell! ⌚',
		'🔮 At high tide. Go with the flow! 🌊',
		'🔮 When the rooster crows thrice. Be alert! 🐓',
		'🔮 When the cherry blossoms bloom. Await the beauty! 🌸',
		'🔮 When the Northern lights dance. Keep your hopes high! 🌌',
		'🔮 At the turning of the seasons. Change is constant! 🍁',
		'🔮 When the desert sees rain. Miracles do happen! 🌵',
		'🔮 When the snowflakes fall. Chilly times ahead! ❄️',
		'🔮 When the bell tolls. Listen for the signs! 🔔',
		'🔮 When the rainbow appears. Look for the pot of gold! 🌈',
		'🔮 When the wind changes direction. Adaptability is crucial! 🌬️'
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
		'🔮 It may require some sacrifice. Be brave! 🦁',
	    '🔮 With a leap of faith. Trust yourself! 🏞️',
		'🔮 It will require some elbow grease. Roll up your sleeves! 👔',
		'🔮 By navigating the labyrinth of life. Keep the faith! 🗺️',
		'🔮 It will take a magic carpet ride. Hold on tight! 🧞',
		'🔮 With a pinch of patience and a dollop of determination. 🍳',
		'🔮 Through a series of fortunate events. Stay positive! 🍀',
		'🔮 With the swing of a pendulum. Maintain balance! ⚖️',
		'🔮 It may require a game of chess with destiny. Think strategically! ♟️',
		'🔮 Through the whisper of a gentle breeze. Stay attentive! 🍃',
		'🔮 It might take a dance with the stars. Keep your rhythm! 💃',
		'🔮 By riding the waves of change. Stay afloat! 🌊',
		'🔮 It will be a rollercoaster ride. Enjoy the ups and downs! 🎢',
		'🔮 By planting seeds today for a tree tomorrow. Patience is key! 🌳',
		'🔮 It will require a bit of moonwalk. Be smooth! 🌝',
		'🔮 By catching the right wind. Set your sails! ⛵',
		'🔮 Through the power of a thousand suns. Harness your energy! ☀️',
		'🔮 With a swift ride on a comet. Buckle up! 🌠',
		'🔮 It will be like threading a needle. Precision is important! 🪡',
		'🔮 With a stroke of a painter’s brush. Create your masterpiece! 🎨'
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
		'🔮 Your question has been abducted by aliens. Please ask another. 👽',
		'🔮 My crystal ball is in a software update. Try again later! 🔄',
		'🔮 The future is currently in airplane mode. Please ask again. ✈️',
		'🔮 My sixth sense is buffering. Please stand by... 📶',
		'🔮 The cosmos is currently out to lunch. Please try again later. 🍽️',
		'🔮 My psychic abilities are stuck in traffic. Try again soon! 🚦',
		'🔮 Your question got lost in the space-time continuum. Please rephrase. 🌀',
		'🔮 My telepathic pigeons flew off course. Try again! 🐦',
		'🔮 Your question is playing hide and seek in the astral plane. Try later. 🌠',
		'🔮 The spirits are currently binge-watching a series. Ask again later. 📺',
		'🔮 My crystal ball is on a coffee break. Try again in a bit. ☕',
		'🔮 Your question went out of orbit. Please rephrase and ask again. 🪐',
		'🔮 My psychic powers are currently in the middle of a software patch. Try again later. ⚙️',
		'🔮 The spirits are currently offline for maintenance. Please check back soon! 💻',
		'🔮 My psychic abilities have taken a sick leave today. Try again tomorrow. 🌡️',
		'🔮 Your question is stuck in cosmic customs. Please ask again. 🛄',
		'🔮 The universe needs more time to bake an answer. Try again later. 🍪',
		'🔮 My third eye is currently in the middle of a yoga class. Try again later. 🧘‍♀️',
		'🔮 The stars are currently in a strategy meeting. Ask again later. 🌟'
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

	function fancyConsoleLog(username, profile) {
		console.log(
			`%c Username: ${username} \n Positive messages: ${profile.positive} \n Negative messages: ${profile.negative} \n Neutral messages: ${profile.neutral} \n Total words: ${profile.totalWords} \n Average Word Length: ${profile.averageWordLength}`,
			'background: black; color: white'
		);
	}

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

	let pendingMessages = []; // Array to store pending chat messages

	const sendChatMessage = (message) => {
	  if (inputArea.value === '' || inputArea.value === null) {
		submitMessage(message);
	  } else {
		pendingMessages.push(message); // Store the message in the pendingMessages array
	  }
	};

	const submitMessage = (message) => {
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
	};

	// Function to check if the input area is empty and submit any pending messages
	const checkInputArea = () => {
	  if (inputArea.value === '' || inputArea.value === null) {
		if (pendingMessages.length > 0) {
		  const message = pendingMessages.shift(); // Get the first pending message
		  submitMessage(message);
		}
	  }
	};

	const handleEightBallQuestion = ({ username, message }) => {
		if (message.startsWith(`${prefix}8ball`)) {
			const question = message.slice(`${prefix}8ball`.length).trim();
			// If there is no text after 8ball, don't respond and return early
			if (!question) {
				return;
			}
			let responses;
			if (question.toLowerCase().includes('should') || question.toLowerCase().includes(' or ')) {
				responses = yesNoResponses;
			} else if (question.toLowerCase().includes('when')) {
				responses = whenResponses;
			} else if (question.toLowerCase().includes('how')) {
				responses = howResponses;
			} else if (question.toLowerCase().includes('where')) {
				// You can use an existing response array for new keywords
				responses = unknownResponses;
			} else if (question.toLowerCase().includes('why')) {
				// You can use an existing response array for new keywords
				responses = yesNoResponses;
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

	class BlackjackGame {
	  constructor(username) {
		this.username = username;
		this.playerHand = [];
		this.dealerHand = [];
		this.gameState = 'waitingForPlayer';
		this.startTime = Date.now();
		this.lastActivity = Date.now();
	  }
	  get playerTotal() {
		return this.playerHand.reduce((total, card) => total + card.value, 0);
	  }
	  get dealerTotal() {
		return this.dealerHand.reduce((total, card) => total + card.value, 0);
	  }
	}

	let gamesInProgress = {};
	let playerCooldowns = {};

	function startNewGame(username) {
	  if (!gamesInProgress[username] || gamesInProgress[username].gameState !== 'active') {
		const game = new BlackjackGame(username);
		gamesInProgress[username] = game;
		playerCooldowns[username] = Date.now() + 60000; // Set a 1-minute cooldown for the user
		gamesInProgress[username].gameState = 'active';
		// Deal two cards each to the player and dealer at the start of the game
		dealCard(game, 'player', 2);
		dealCard(game, 'dealer', 2);
	  }
	}

	function isPlayerOnCooldown(username) {
	  const currentTime = Date.now();
	  const cooldownEnd = playerCooldowns[username];
	  if (cooldownEnd && currentTime < cooldownEnd) {
		const game = gamesInProgress[username];
		if (game && game.gameState !== 'active') {
		  // Cooldown only applies if the player has completed a game
		  return true;
		}
	  }
	  return false;
	}

	function calculateTotal(cards) {
	  let total = cards.reduce((a, card) => a + card.value, 0);
	  // if total > 21 and there's an ace (value 1), subtract 10
	  if (total > 21 && cards.some(card => card.value === 1)) {
		total -= 10;
	  }
	  return total;
	}

	const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
	const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

	function createDeck(numDecks) {
	  const deck = [];
	  for (let i = 0; i < numDecks; i++) {
		ranks.forEach((rank, index) => {
		  suits.forEach((suit) => {
			let value = index + 1;
			if (value > 10) value = 10;
			if (value === 1) value = 11;
			deck.push({ rank, suit, value });
		  });
		});
	  }
	  return deck;
	}
	let deck = createDeck(6); // Create a deck with 6 standard decks

	function getCardEmoji(suit) {
	  // Define mapping of suits to emojis
	  const suitEmojis = {
		hearts: '❤️',
		diamonds: '♦️',
		clubs: '♣️',
		spades: '♠️'
	  };
	  return suitEmojis[suit] || '';
	}

	function getRankEmoji(rank) {
	  const rankEmojis = {
		'2': '2️⃣',
		'3': '3️⃣',
		'4': '4️⃣',
		'5': '5️⃣',
		'6': '6️⃣',
		'7': '7️⃣',
		'8': '8️⃣',
		'9': '9️⃣',
		'10': '🔟',
		'J': '🃏',
		'Q': '👸',
		'K': '🤴',
		'A': '🅰️'
	  };
	  return rankEmojis[rank] || '';
	}

	function getHandEmoji(hand) {
	  const handEmojis = {
		2: '👐',
		3: '🤟',
		4: '🙌',
		5: '🙏',
		6: '👏',
		7: '👍',
		8: '👌',
	  };
	  const handLength = hand.length;
	  return handEmojis[handLength] || '';
	}

	function getHandString(hand) {
	  return hand.map(card => `[${getRankEmoji(card.rank)}${getCardEmoji(card.suit)}]`).join(' ');
	}

	function dealCard(game, recipient, numCards = 1) {
	  if (deck.length === 0) {
		deck = createDeck(6);
	  }

	  const newCards = [];
	  for (let i = 0; i < numCards; i++) {
		const newCardIndex = Math.floor(Math.random() * deck.length);
		const newCard = deck.splice(newCardIndex, 1)[0];
		newCards.push(newCard);
		if (recipient === 'player') {
		  game.playerHand.push(newCard);
		} else if (recipient === 'dealer') {
		  game.dealerHand.push(newCard);
		}
	  }

	  if (recipient === 'player') {
		const total = calculateTotal(game.playerHand);
		if (total > 21) {
		  game.gameState = 'playerBust';
		  sendChatMessage(`${game.username}, you drew ${getHandString(newCards)}. Your cards are now: ${getHandString(game.playerHand)}. Your total is ${total} ${getHandEmoji(game.playerHand)}. Game over.`);
		} else {
		  sendChatMessage(`${game.username}, you drew ${getHandString(newCards)}. Your cards are now: ${getHandString(game.playerHand)}. Your total is ${total} ${getHandEmoji(game.playerHand)}.`);
		}
	  }
	}

	function handleEndOfTurn(game) {
	  while (calculateTotal(game.dealerHand) < 17) {
		dealCard(game, 'dealer');
	  }
	  game.gameState = 'waitingForPlayer';
	  const playerTotal = calculateTotal(game.playerHand);
	  const dealerTotal = calculateTotal(game.dealerHand);

	  let message = '';

	  if (dealerTotal > 21) {
		message = `🎉 ${game.username}, the dealer busted with a total of ${dealerTotal}! You win with a total of ${playerTotal}. 🎉`;
	  } else if (dealerTotal > playerTotal) {
		message = `😢 ${game.username}, the dealer wins with a total of ${dealerTotal} against your total of ${playerTotal}. 😢`;
	  } else if (dealerTotal < playerTotal) {
		message = `🎉 ${game.username}, you win with a total of ${playerTotal} against the dealer's total of ${dealerTotal}. 🎉`;
	  } else {
		message = `🤝 ${game.username}, it's a draw! Both you and the dealer have a total of ${playerTotal}. 🤝`;
	  }

	  sendChatMessage(message);
	}

	function handlePlayerBust(game) {
	  game.gameState = 'playerBust';
	  const playerTotal = calculateTotal(game.playerHand);
	  sendChatMessage(`😫 ${game.username}, you busted with a total of ${playerTotal}. Game over. 😫`);
	}

	function handleBlackjack(game) {
	  game.gameState = 'blackjack';
	  const playerTotal = calculateTotal(game.playerHand);
	  sendChatMessage(`🎉 ${game.username}, you got a Blackjack with a total of ${playerTotal}! You win! 🎉`);
	}

	function isGameActive(username) {
	  const game = gamesInProgress[username];
	  return game && game.gameState === 'active';
	}

	function handleBlackjackCommand({ username, message }) {
	  if (isPlayerOnCooldown(username)) {
		return;
	  }
	  if (message.startsWith('!blackjack')) {
		startNewGame(username);
	  } else if (message.startsWith('!hit') && isGameActive(username)) {
		const game = gamesInProgress[username];
		game.gameState = 'active';
		dealCard(game, 'player', 1); // Deal 1 card when using !hit
	  } else if (message.startsWith('!stand') && isGameActive(username)) {
		const game = gamesInProgress[username];
		handleEndOfTurn(game);
	  } else if (message.startsWith('!bust') && isGameActive(username)) {
		const game = gamesInProgress[username];
		handlePlayerBust(game);
	  }
	}

	const handleWouldYouRatherCommand = ({ username, message }) => {
	  const command = message.slice(1);
	  if (command === 'wouldyourather' && username !== self) {
		const randomIndex = Math.floor(Math.random() * wouldYouRatherQuestions.length);
		sendChatMessage(`${wouldYouRatherQuestions[randomIndex]} Please type your answer, ${username}!`);
	  }
	};

	let users = {};
    const cooldowns = {};
	const MAX_HEALTH = 100;
	const MAX_DAMAGE = 80;
	const MID_DAMAGE_CHANCE = 0.25;
	const HIGH_DAMAGE_CHANCE = 0.05;
	const COOLDOWN_DURATION = 30 * 1000; // 30 seconds cooldown duration
	const SAME_USER_COOLDOWN_DURATION = 24 * 60 * 60 * 1000; // 24 hours cooldown for the same user

	const processMessageAndGreet = ({ username, message }) => {
	  const cleanedUsername = username.replace(/[\s\W]+/g, '');
	  if (message.startsWith(prefix)) {
		const command = message.slice(prefix.length);
		if (enableCommands && enableGames) {
		  handleEightBallQuestion({ username, message });
		  handleBlackjackCommand({ username, message });
		  handleWouldYouRatherCommand({ username, message });

		  // Check for Slash Command
		  if (command.startsWith('slash')) {
			// Get the target username
			const targetUsername = command.split(' ')[1];
			if (targetUsername) {
			  // Process slash command
			  processSlashCommand(cleanedUsername, targetUsername);
			}
		  }
		  if (command.startsWith('save')) {
			  // Get the target username
			  const targetUsername = command.split(' ')[1];
			  if (targetUsername) {
				// Process save command
				processSaveCommand(cleanedUsername, targetUsername);
			  }
		  }
		}
		if (command === 'hello' && cleanedUsername !== self && enableCommands) {
		  const randomIndex = Math.floor(Math.random() * greetings.length);
		  sendChatMessage(`${greetings[randomIndex]}, ${cleanedUsername}!`);
		}
	  }
	};

	const processSaveCommand = (savior, target) => {
	  // Convert target to lowercase for comparison
	  const targetLowerCase = target.toLowerCase();

	  // If the savior is dead, they can't save
	  if (users[savior] && users[savior].health <= 0) {
		console.log(`${savior} is dead and can't save`);
		sendChatMessage(`Sorry, ${savior}. You can't save while you're dead.`);
		return;
	  }

	  // If the savior's health is less than 5%, they can't save
	  if (users[savior] && users[savior].health < 5) {
		console.log(`${savior} has less than 5% health and can't save`);
		sendChatMessage(`Sorry, ${savior}. You can't save while your health is less than 5%.`);
		return;
	  }

	  // Calculate health to save
	  const healthToSave = calculateSave();

	  // Deduct health from savior's health
	  let newHealth = users[savior].health - healthToSave;

	  // If savior dies in the process of saving
	  if (newHealth <= 0) {
		// Send a chat message announcing the savior's death and how much health the target received
		sendChatMessage(`${savior} died while saving ${target}. ${target} received ${healthToSave.toFixed(2)}% health.`);
		// Update target's health
		users[targetLowerCase].health = Math.min(MAX_HEALTH, users[targetLowerCase].health + healthToSave);
		// Calculate remaining save to inflict on the savior
		let remainingSave = Math.abs(newHealth);
		users[savior].health = Math.max(0, users[savior].health - remainingSave);
	  } else {
		// Update savior's health
		users[savior].health = newHealth;
		// Update target's health
		users[targetLowerCase].health = Math.min(MAX_HEALTH, users[targetLowerCase].health + healthToSave);
		// Send a chat message with the savior's and target's current health
		sendChatMessage(`${savior} saved ${target} by giving ${healthToSave.toFixed(2)}% health. ${savior}'s current health is ${users[savior].health.toFixed(2)}%. ${target}'s current health is ${users[targetLowerCase].health.toFixed(2)}%.`);
	  }
	};

	const calculateSave = () => {
	  let random = Math.random();

	  if (random <= HIGH_DAMAGE_CHANCE) {
		return Math.random() * (MAX_DAMAGE - 40) + 40; // Random save between 40 and 80
	  } else if (random <= MID_DAMAGE_CHANCE) {
		return Math.random() * 40; // Random save between 0 and 40
	  } else {
		return Math.random() * 20; // Random save between 0 and 20
	  }
	};


	const processSlashCommand = (attacker, target) => {
	  // Convert target to lowercase for comparison
	  const targetLowerCase = target.toLowerCase();
	  const usernameRegex = /^[a-zA-Z0-9._-]+$/;
	  if (!usernameRegex.test(target)) {
		console.log(`Invalid username: ${target}`);
		sendChatMessage(`Invalid target username. Only letters, numbers, dashes, underscores, and periods are allowed.`);
		return;
	  }

	  // If the target user is not in the game, add them
	  if (!users[targetLowerCase]) {
		console.log(`Adding new user: ${target}`);
		// Store the username in its original case
		users[targetLowerCase] = { username: target, health: MAX_HEALTH, lastDamage: 0, lastAttacked: {} };
	  }

	  // If the attacker is not in the game, add them
	  if (!users[attacker]) {
		console.log(`Adding new attacker: ${attacker}`);
		users[attacker] = { username: attacker, health: MAX_HEALTH, lastDamage: 0, lastAttacked: {} };
	  }

	  if (users[attacker] && users[attacker].health <= 0) {
		console.log(`${attacker} is dead and can't attack`);
		sendChatMessage(`Sorry, ${attacker}. You can't attack while you're dead.`);
		return;
	  }

	  // If the target user is dead, the attack rebounds on the attacker
	  if (users[targetLowerCase].health <= 0) {
		console.log(`Target ${target} is dead. Rebounding attack on ${attacker}`);
		slash(attacker, attacker);
	  } else {
		const now = Date.now();
		const lastAttackedByAttacker = users[targetLowerCase].lastAttacked[attacker];
		const lastAttackedByTarget = users[attacker].lastAttacked[targetLowerCase];

		// Check if the attacker has attacked the same target within the 24-hour cooldown
		if (lastAttackedByAttacker && now - lastAttackedByAttacker < SAME_USER_COOLDOWN_DURATION) {
		  console.log(`${attacker} attacked ${target} within the 24-hour cooldown`);
		  sendChatMessage(`Sorry, ${attacker}. You cannot attack ${target} again within a 24-hour period.`);
		  return;
		}

		// Check if the target has been attacked by the same attacker within the 24-hour cooldown
		if (lastAttackedByTarget && now - lastAttackedByTarget < SAME_USER_COOLDOWN_DURATION) {
		  console.log(`${target} was attacked by ${attacker} within the 24-hour cooldown`);
		  sendChatMessage(`Sorry, ${attacker}. ${target} cannot be attacked again within a 24-hour period.`);
		  return;
		}

		// Update last attacked timestamps for the attacker and target
		users[targetLowerCase].lastAttacked[attacker] = now;
		users[attacker].lastAttacked[targetLowerCase] = now;

		// Proceed with the attack
		console.log(`Attacking ${target} with ${attacker}`);
		slash(attacker, targetLowerCase);
	  }
	};

	const slash = (attacker, target) => {
	  // Calculate damage
	  const damage = calculateDamage();

	  // Deduct damage from target's health
	  let newHealth = users[target].health - damage;

	  // Store last damage for attacker
	  users[attacker].lastDamage = damage;

	  if (newHealth <= 0) {
		// Send a chat message announcing the target's death
		sendChatMessage(`${users[target].username} was attacked by ${attacker} and has died!`);

		// Calculate remaining damage to inflict on the attacker
		let remainingDamage = Math.abs(newHealth);
		users[attacker].health = Math.max(0, users[attacker].health - remainingDamage);
		sendChatMessage(`The remaining ${remainingDamage.toFixed(2)}% damage was inflicted on ${attacker}. ${attacker}'s current health is ${users[attacker].health.toFixed(2)}%.`);
	  } else {
		// Update target's health
		users[target].health = newHealth;

		// Send a chat message with the target's current health
		sendChatMessage(`${users[target].username} was attacked by ${attacker} and took ${damage.toFixed(2)}% damage. ${users[target].username}'s current health is ${users[target].health.toFixed(2)}%.`);
	  }
	};


	const calculateDamage = () => {
	  let random = Math.random();

	  if (random <= HIGH_DAMAGE_CHANCE) {
		return Math.random() * (MAX_DAMAGE - 40) + 40; // Random damage between 40 and 80
	  } else if (random <= MID_DAMAGE_CHANCE) {
		return Math.random() * 40; // Random damage between 0 and 40
	  } else {
		return Math.random() * 20; // Random damage between 0 and 20
	  }
	};

	setInterval(() => {
	  // Reset health and damage at midnight
	  let now = new Date();
	  if (now.getHours() === 0 && now.getMinutes() === 0) {
		for (let username in users) {
		  users[username].health = MAX_HEALTH;
		  users[username].lastDamage = 0;
		}
	  }

	  // Existing code
	  for (let username in gamesInProgress) {
		const game = gamesInProgress[username];
		if (game.gameState !== 'active') {
		  // Skip players who have ended their game
		  continue;
		}
		if (Date.now() - game.lastActivity > 60000) {
		  sendChatMessage(`😫 Sorry ${username}, your game of Blackjack has been ended due to inactivity. Your score was 17 or less! 😫`);
		  delete gamesInProgress[username];
		}
	  }
	  for (let username in playerCooldowns) {
		if (Date.now() >= playerCooldowns[username]) {
		  delete playerCooldowns[username];
		}
	  }
	}, 60000);


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
		// Call the fancyConsoleLog function to print the updated profile in a fancy way
		fancyConsoleLog(username, userProfiles[username]);
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