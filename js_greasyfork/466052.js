// ==UserScript==
// @name         Chatbotv1.9
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  A script to listen to chat messages and respond mostly to a specific prefix but meh optional?
// @author       BadNintendo
// @match        https://www.shutdown.chat/*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466052/Chatbotv19.user.js
// @updateURL https://update.greasyfork.org/scripts/466052/Chatbotv19.meta.js
// ==/UserScript==

(function() {
    'use strict';
	window.addEventListener('load', () => {
const prefix = '!';
const enableCommands = true;
const enableResonses = false;
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
const self = document.querySelector('#profile p').textContent.trim();
const lastGreeted = {};

const handleUserJoin = (node) => {
  const joinMessageRegex = /(.+) has joined the room/;
  const userJoinElement = node.querySelector('.sysmsg');
  if (userJoinElement) {
    const joinText = userJoinElement.textContent;
    const joinedMatch = joinText.match(joinMessageRegex);
    if (joinedMatch) {
      const username = joinedMatch[1];
      greetUserOnJoin(username);
    }
  }
};

const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "Why don't some couples go to the gym? Because some relationships don't work out!",
  "What do you call fake spaghetti? An impasta!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "Why don't oysters donate to charity? Because they're shellfish!",
  "Why did the bicycle fall over? Because it was two-tired!",
  "Why did the tomato turn red? Because it saw the salad dressing!",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
  "Why did the math book look sad? Because it had too many problems!",
  "Why couldn't the bicycle stand up by itself? It was two tired.",
  "What do you call cheese that isn't yours? Nacho cheese!",
  "Why couldn't the pony sing a lullaby? She was a little horse.",
  "Why did the scarecrow win an award? Because he was outstanding in his field.",
  "Why did the chicken go to the seance? To get to the other side.",
  "How does a train eat? It goes chew chew.",
  "Why don't some couples go to the gym? Because some relationships don't work out.",
  "How does a penguin build its house? Igloos it together.",
  "What do you call a group of musical notes? A chord-ial reunion.",
  "Why did the tomato turn red? Because it saw the salad dressing!",
  "What do you call a pile of cats? A meowtain.",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
  "What do you call a fake noodle? An impasta.",
  "Why did the scarecrow win an award? Because he was outstanding in his field.",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
  "Why did the math book look sad? Because it had too many problems!",
  "Why did the tomato turn red? Because it saw the salad dressing!",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
  "What do you call a bear with no teeth? A gummy bear!",
  "Why did the math book look sad? Because it had too many problems!",
  "Why did the tomato turn red? Because it saw the salad dressing!",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "Why did the tomato turn red? Because it saw the salad dressing!",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
  "Why did the math book look sad? Because it had too many problems!",
  "What do you call a computer that sings? A-dell.",
  "Why did the scarecrow win an award? Because he was outstanding in his field.",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
  "What do you call a fake noodle? An impasta.",
  "Why did the tomato turn red? Because it saw the salad dressing!",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
  "Why did the math book look sad? Because it had too many problems!",
  "Why don't scientists trust atoms? Because they make up everything!",
  "Why don't some couples go to the gym? Because some relationships don't work out!",
  "What do you call fake spaghetti? An impasta!",
];

const handleKeywords = (username, message) => {
  const cleanedUsername = username.replace(/[\s\W]+/g, '');
  if (message.includes('weather')) {
    if(enableResonses) sendChatMessage(`Hey ${cleanedUsername}, I don't have weather info, but you can check a weather website!`);
	else console.log(`Hey ${cleanedUsername}, I don't have weather info, but you can check a weather website!`);
  } else if (message.includes('joke')) {
    const jokes = [
      "Why did the chicken cross the playground? To get to the other slide.",
      "I'm reading a book on anti-gravity. It's impossible to put down!",
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why do we tell actors to 'break a leg?' Because every play has a cast!",
      "What do you call an alligator wearing a vest? An investigator!",
      "Why don't oysters give to charity? Because they're shellfish!",
      "What do you call a fake noodle? An impasta!",
      "What do you call a can opener that doesn't work? A can't opener!"
    ];
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    if(enableResonses) sendChatMessage(`${cleanedUsername}, here's a joke for you: ${randomJoke}`);
	else console.log(`${cleanedUsername}, here's a joke for you: ${randomJoke}`);
  }
};

let timeoutAI = null;
const handleQuestions = (username, message) => {
if (timeoutAI !== null && Date.now() - timeoutAI < 30000) {
    return;
}
timeoutAI = Date.now();
  const cleanedUsername = username.replace(/[\s\W]+/g, '');
  const questionWords = ['what', 'when', 'where', 'why', 'how', 'who', 'which'];
  const questionTypes = {
    'what': 'information',
    'when': 'time',
    'where': 'place',
    'why': 'reason',
    'how': 'method',
    'who': 'person',
    'which': 'choice'
  }
  const questionWord = questionWords.find(word => message.toLowerCase().startsWith(word));

  if (message.endsWith('?')) {
    if(enableResonses) {
		if (questionWord) {
		  sendChatMessage(`That's a great ${questionTypes[questionWord]} question, ${cleanedUsername}! Unfortunately, I don't know the answer. Maybe someone else in the chat does?`);
		} else if (message.toLowerCase().includes('meaning of life')) {
		  sendChatMessage(`That's a tough one, ${cleanedUsername}. I'm not sure anyone really knows the answer to that.`);
		} else if (message.toLowerCase().includes('what are you')) {
		  sendChatMessage(`I'm a chatbot, ${cleanedUsername}. I'm here to chat with you and try to help out with any questions you might have.`);
		} else if (message.toLowerCase().includes('how are you')) {
		  sendChatMessage(`I'm just a program, ${cleanedUsername}, so I don't have feelings. But thanks for asking!`);
		} else {
		  sendChatMessage(`I'm not sure, ${cleanedUsername}. Can anyone else help with this question?`);
		}
	}
	else {
		if (questionWord) {
		  console.log(`That's a great ${questionTypes[questionWord]} question, ${cleanedUsername}! Unfortunately, I don't know the answer. Maybe someone else in the chat does?`);
		} else if (message.toLowerCase().includes('meaning of life')) {
		  console.log(`That's a tough one, ${cleanedUsername}. I'm not sure anyone really knows the answer to that.`);
		} else if (message.toLowerCase().includes('what are you')) {
		  console.log(`I'm a chatbot, ${cleanedUsername}. I'm here to chat with you and try to help out with any questions you might have.`);
		} else if (message.toLowerCase().includes('how are you')) {
		  console.log(`I'm just a program, ${cleanedUsername}, so I don't have feelings. But thanks for asking!`);
		} else {
		  console.log(`I'm not sure, ${cleanedUsername}. Can anyone else help with this question?`);
		}
	}
  }
};


const handleHelpRequests = (username, message) => {
  const cleanedUsername = username.replace(/[\s\W]+/g, '');
  if (message.toLowerCase().includes('help')) {
    if(enableResonses) sendChatMessage(`Hey ${cleanedUsername}, what do you need help with?`);
	else console.log(`Hey ${cleanedUsername}, what do you need help with?`);
  }
};

const handleEmotions = (username, message) => {
  const cleanedUsername = username.replace(/[\s\W]+/g, '');
  if(enableResonses) {
	  if (message.includes(':)') || message.includes('happy')) {
		sendChatMessage(`Glad to see you're happy, ${cleanedUsername}!`);
	  } else if (message.includes(':(') || message.includes('sad')) {
		sendChatMessage(`I'm sorry to hear that, ${cleanedUsername}. I hope things get better for you.`);
	  } else if (message.includes(':D') || message.includes('laugh')) {
		sendChatMessage(`Haha, that's funny ${cleanedUsername}!`);
	  } else if (message.includes(':O') || message.includes('surprised')) {
		sendChatMessage(`Wow, that's surprising ${cleanedUsername}!`);
	  } else if (message.includes(':P') || message.includes('playful')) {
		sendChatMessage(`Hehe, you're being silly ${cleanedUsername}!`);
	  } else if (message.includes(':/') || message.includes('confused')) {
		sendChatMessage(`I can see why you're confused, ${cleanedUsername}. Let me see if I can help!`);
	  } else if (message.includes(':|') || message.includes('neutral')) {
		sendChatMessage(`You seem neutral, ${cleanedUsername}. Is everything okay?`);
	  } else if (message.includes(':s') || message.includes('worried')) {
		sendChatMessage(`I understand why you're worried, ${cleanedUsername}. Let me know if I can help!`);
	  } else {
		sendChatMessage(`Thanks for sharing, ${cleanedUsername}!`);
	  }
  }
  else {
	  if (message.includes(':)') || message.includes('happy')) {
		console.log(`Glad to see you're happy, ${cleanedUsername}!`);
	  } else if (message.includes(':(') || message.includes('sad')) {
		console.log(`I'm sorry to hear that, ${cleanedUsername}. I hope things get better for you.`);
	  } else if (message.includes(':D') || message.includes('laugh')) {
		console.log(`Haha, that's funny ${cleanedUsername}!`);
	  } else if (message.includes(':O') || message.includes('surprised')) {
		console.log(`Wow, that's surprising ${cleanedUsername}!`);
	  } else if (message.includes(':P') || message.includes('playful')) {
		console.log(`Hehe, you're being silly ${cleanedUsername}!`);
	  } else if (message.includes(':/') || message.includes('confused')) {
		console.log(`I can see why you're confused, ${cleanedUsername}. Let me see if I can help!`);
	  } else if (message.includes(':|') || message.includes('neutral')) {
		console.log(`You seem neutral, ${cleanedUsername}. Is everything okay?`);
	  } else if (message.includes(':s') || message.includes('worried')) {
		console.log(`I understand why you're worried, ${cleanedUsername}. Let me know if I can help!`);
	  } else {
		console.log(`Thanks for sharing, ${cleanedUsername}!`);
	  }
  }
};



const handleEightBallQuestion = ({ message }) => {
  if (message.startsWith(`${prefix}8ball`)) {
    const command = message.slice(6);
    if (command === 'responses') {
      sendChatMessage(`The available responses are: ${eightBallResponses.join(', ')}`);
      return;
    }
    const randomResponseIndex = Math.floor(Math.random() * eightBallResponses.length);
    const response = eightBallResponses[randomResponseIndex];
    sendChatMessage(response);
  }
};

const handleGreeting = ({ username, message }) => {
    const cleanedUsername = username.replace(/[\s\W]+/g, '');
    if (message.startsWith(prefix)) {
        const command = message.slice(1);
        handleEightBallQuestion({ message });
        if (command === 'hello') {
            const lastGreetedTime = lastGreeted[cleanedUsername] || 0;
            if (Date.now() - lastGreetedTime > 2 * 60 * 1000) {
                const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

                if (username !== self) {
                    sendChatMessage(`${randomGreeting}, ${cleanedUsername}!`);
                }

                lastGreeted[cleanedUsername] = Date.now();
            }
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
          inputArea.value = '';
        }, 200);
      }
    }, 500);
  }
};

let onloadHaltTime = Date.now();
let lastProcessedTime = Date.now();
const processMessage = async (username, message) => {
  const cleanedUsername = username.replace(/[\s\W]+/g, '').toLowerCase();
  const cleanedMessage = message ? message.trim().toLowerCase() : '';
  if (!message || cleanedUsername === self) {
	  return;
  }
  if (Date.now() - onloadHaltTime < 30000 && enableCommands) {
	  // Check if the message is new
	  //handleMention(username, message);
	  handleKeywords(username, message);
	  handleEmotions(username, message);
	  handleHelpRequests(username, message);
	  handleQuestions(username, message);
	  if (cleanedMessage.startsWith(prefix)) {
		const command = cleanedMessage.slice(1);

let currentTime = Date.now();
if (currentTime - lastProcessedTime < 5000) {
  return;
}
lastProcessedTime = currentTime;

		if (command === 'hello') {
		  const lastGreetedTime = lastGreeted[cleanedUsername] || 0;
		  if (Date.now() - lastGreetedTime > 2 * 60 * 1000) {
			const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
			sendChatMessage(`${randomGreeting}, ${cleanedUsername}!`);
			lastGreeted[cleanedUsername] = Date.now();
		  }
		} else if (command === 'joke') {
		  const randomJoke = getRandomFunnyResponse();
		  sendChatMessage(`${cleanedUsername}, here's a joke for you: ${randomJoke}`);
		} else if (command === 'topic' || command === 'trivia' || command === 'fact') {
		  if (Date.now() - lastRequestTime[command] > 10 * 60 * 1000) {
			lastRequestTime[command] = Date.now();
			handleRequest({ command, username: cleanedUsername });
		  } else {
			sendChatMessage(`Sorry, ${cleanedUsername}, please wait a bit before making another ${command} request.`);
		  }
		} else if (command === 'help') {
		  sendHelpMessage(cleanedUsername);
		} else if (command.startsWith('8ball')) {
		  const question = command.slice(6).trim();
		  if (question.length === 0) {
			sendChatMessage(`Please ask a question, ${cleanedUsername}.`);
		  } else {
			const randomResponseIndex = Math.floor(Math.random() * eightBallResponses.length);
			const response = eightBallResponses[randomResponseIndex];
			sendChatMessage(`${response}, ${cleanedUsername}.`);
		  }
		} else {
		  sendChatMessage(`Sorry, ${cleanedUsername}, I don't recognize that command.`);
		}
	  } else if (currentTriviaQuestion && cleanedMessage.includes(currentTriviaQuestion.answer.toLowerCase())) {
		if (!userScores[cleanedUsername]) {
		  userScores[cleanedUsername] = 0;
		}
		userScores[cleanedUsername]++;
		sendChatMessage(
		  `Congratulations, ${cleanedUsername}! You got the correct answer. Your score is now ${userScores[cleanedUsername]}.`
		);
		currentTriviaQuestion = null;
	  }
  }
};



const processMessage2 = async (username, message) => {
  const cleanedUsername = username.replace(/[\s\W]+/g, '').toLowerCase();
  const cleanedMessage = message && message.trim().toLowerCase();
  handleMention(username, message);
  handleKeywords(username, message);
  handleQuestions(username, message);
  handleHelpRequests(username, message);
  handleEmotions(username, message);
  checkTriviaAnswer(username, message);
  handleScoreCheck(username, message);

  if (message.startsWith(prefix)) {
    const command = message.slice(1);
    handleEightBallQuestion({ message });
    if (command === 'hello' && cleanedUsername !== self) {
      const randomIndex = Math.floor(Math.random() * greetings.length);
      sendChatMessage(`${greetings[randomIndex]}, ${cleanedUsername}!`);
    }
    if (command === 'joke') {
      const randomJoke = getRandomFunnyResponse();
      sendChatMessage(randomJoke);
    }
    if (command === 'topic' || command === 'trivia' || command === 'fact') {
      if(cleanedUsername !== self) handleRequest({ command, username: cleanedUsername });
    }
    if (command === 'help' && cleanedUsername !== self) {
      sendHelpMessage(cleanedUsername);
    }
  } else if (currentTriviaAnswer && message.toLowerCase().includes(currentTriviaAnswer) && cleanedUsername !== self) {
    sendChatMessage(`Congratulations, ${cleanedUsername}! You got the correct answer!`);
    currentTriviaAnswer = null;
  }

  // Add sentiment-based response handling
  await handleSentimentBasedResponse(message);
};


const empatheticResponses = [
    "I'm sorry to hear that.",
    "That sounds tough.",
    "I can imagine how you feel.",
    "It's okay to feel that way.",
    "You're not alone.",
    "It's completely normal to feel like that.",
    "Take your time.",
    "I'm here for you.",
    "You're strong.",
    "It's okay to ask for help.",
    "You've got this.",
    "I understand how you're feeling.",
    "You're doing your best.",
    "It's okay to take a break.",
    "You're allowed to feel overwhelmed.",
    "Hang in there.",
    "You're not a burden.",
    "You're important.",
    "Don't be too hard on yourself.",
    "It's tough, but you can get through this.",
    "You're supported.",
    "It's okay to feel upset.",
    "You're not alone in feeling this way.",
    "It's okay to need help.",
    "I'm here to listen.",
];

const funnyResponses = [
    "Why did the tomato turn red? Because it saw the salad dressing!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears!",
    "What do you call a pile of cats? A meowtain!",
    "Why don't some couples go to the gym? Because some relationships don't work out!",
    "Why couldn't the bicycle stand up by itself? It was two-tired!",
    "What do you call a fake noodle? An impasta!",
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    "What do you call a snobbish criminal going downstairs? A condescending con descending!",
    "Why did the scarecrow become a successful neurosurgeon? He was always outstanding in his field!",
    "Why did the coffee file a police report? It got mugged!",
    "What do you call an alligator in a vest? An investigator!",
    "How does a train eat? It goes chew chew!",
    "Why did the chicken go to the séance? To get to the other side!",
    "Why did the picture go to jail? Because it was framed!",
    "What do you call a dinosaur with an extensive vocabulary? A thesaurus!",
    "Why don't skeletons fight each other? They don't have the guts!",
    "What did the buffalo say when his son left for college? Bison!",
    "What do you call a can opener that doesn't work? A can't opener!",
    "Why did the belt go to jail? Because it held up a pair of pants!",
    "Why did the chicken sit on her eggs? She didn't want to lay a standing ovation!",
    "What do you get when you cross a snowman and a vampire? Frostbite!",
    "What do you call a sheep with no legs? A cloud!",
    "Why did the golfer wear two pairs of pants? In case he got a hole in one!",
    "Why did the math book look sad? Because it had too many problems!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why couldn't the pony sing a lullaby? She was a little horse!",
    "Why did the tomato turn red? Because it saw the salad dressing!",
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why don't some couples go to the gym? Because some relationships don't work out!",
    "What do you call fake spaghetti? An impasta!",
];

const getRandomFunnyResponse = () => {
    return funnyResponses[Math.floor(Math.random() * funnyResponses.length)];
};

const positiveKeywords = ["lit",
  "fire",
  "dope",
  "on point",
  "slay",
  "snatched",
  "flex",
  "goals",
  "savage",
  "on fleek",
  "gucci",
  "hype",
  "fam",
  "swole",
  "yass",
  "legit",
  "poppin'",
  "woke",
  "sick",
  "gassed", 'happy', 'great', 'awesome', 'amazing', 'good', 'love', 'excited', 'joy', 'fun'];
const negativeKeywords = ["salty",
  "sus",
  "basic",
  "ratchet",
  "cringe",
  "fomo",
  "shade",
  "thirsty",
  "ghost",
  "cap",
  "dead",
  "flop",
  "lame",
  "meh",
  "nope",
  "played out",
  "roach",
  "swerve",
  "trash",
  "yikes", 'sad', 'angry', 'upset', 'frustrated', 'disappointed', 'bad', 'hate', 'annoyed', 'bored'];

const analyzeSentiment = (message) => {
    const words = message.toLowerCase().split(' ');
    let sentimentScore = 0;

    words.forEach((word) => {
        if (positiveKeywords.includes(word)) {
            sentimentScore++;
        } else if (negativeKeywords.includes(word)) {
            sentimentScore--;
        }
    });

    return sentimentScore;
};


const neutralResponses = [
    "Interesting point.",
    "That's a valid perspective.",
    "I see where you're coming from.",
    "I hadn't thought about it that way.",
    "That's a fair point.",
    "Noted.",
    "I understand your point.",
    "That's something to think about.",
    "It's always good to hear different opinions.",
    "I can see that.",
    "Everyone has their own perspective.",
    "I'll consider that.",
    "That's an interesting take.",
    "That's one way to look at it.",
    "Thanks for sharing your thoughts.",
    "I appreciate your input.",
    "That's an intriguing idea.",
    "You've given me something to ponder.",
    "Food for thought.",
    "That's worth considering.",
    "I can see why you think that.",
    "Interesting viewpoint.",
    "I hadn't seen it that way before.",
    "Your perspective is unique.",
    "That's an alternative way to think about it.",
    "Hmm, I never considered that.",
    "I'll think about that.",
    "I can see your reasoning.",
    "That's an unusual perspective.",
    "Your opinion is noted.",
    "That's a different way to approach it.",
    "I hadn't heard that before.",
    "I can see how you arrived at that conclusion.",
    "That's a thought-provoking idea.",
    "I'll keep that in mind.",
    "Interesting observation.",
    "I hadn't thought of it like that.",
    "I see your point.",
    "You've given me a new perspective.",
    "That's something I hadn't considered.",
    "Your idea is intriguing.",
    "I'm curious about your perspective.",
    "That's an interesting way to look at it.",
    "I can understand that.",
    "That's an unusual take.",
    "I'm always open to new ideas.",
    "It's interesting to hear your thoughts.",
    "That's a unique point of view.",
];

const positiveResponses = [
    "That's awesome!",
    "I'm glad to hear that!",
    "That's great news!",
    "Keep up the good work!",
    "Congratulations!",
    "Well done!",
    "You're doing great!",
    "I'm happy for you!",
    "That's impressive!",
    "Good job!",
    "Way to go!",
    "Nice work!",
    "You should be proud!",
    "Fantastic!",
    "Amazing!",
    "Keep it up!",
    "Great job!",
    "Kudos!",
    "You're doing a great job!",
    "Bravo!",
    "That's wonderful!",
    "You've got this!",
    "That's so cool!",
    "Excellent!",
    "I'm proud of you!",
    "Superb!",
    "You've made progress!",
    "That's a huge accomplishment!",
    "You're on the right track!",
    "You've done well!",
    "Great effort!",
    "Well deserved!",
    "You're making a difference!",
    "You're really improving!",
    "Outstanding!",
    "You're nailing it!",
    "Keep up the excellent work!",
    "You're doing something right!",
    "That's a big achievement!",
    "You're making great strides!",
    "Terrific!",
    "You should be very proud!",
    "You're making progress!",
    "That's a big step forward!",
    "That's a great accomplishment!",
    "You're doing an amazing job!",
    "You've come a long way!",
    "You've really outdone yourself!",
];


const messageQueue = [];
const messageDelay = 5000; // 5 seconds delay between messages

const sendMessageWithDelay = (message) => {
    messageQueue.push(message);
};

const processMessageQueue = () => {
    if (messageQueue.length > 0) {
        const message = messageQueue.shift();
        sendChatMessage(message);
    }
};

setInterval(processMessageQueue, messageDelay);



const getRandomNeutralResponse = () => {
    return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
};

const getRandomPositiveResponse = () => {
    return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
};

const getRandomEmpatheticResponse = () => {
    return empatheticResponses[Math.floor(Math.random() * empatheticResponses.length)];
};

const handleSentimentBasedResponse = async (message) => {
    const sentimentScore = await analyzeSentiment(message);
    if (sentimentScore < 0) { // Negative sentiment
        const empatheticResponse = getRandomEmpatheticResponse();
        sendMessageWithDelay(empatheticResponse);
    } else if (sentimentScore === 0) { // Neutral sentiment
        const neutralResponse = getRandomNeutralResponse();
        sendMessageWithDelay(neutralResponse);
    } else { // Positive sentiment
        const positiveResponse = getRandomPositiveResponse();
        sendMessageWithDelay(positiveResponse);
    }
};




const sendHelpMessage = (username) => {
  const helpMessage = `Commands: !hello, !topic, !trivia, !fact, !8ball, !8ball responses. Prefix commands with !`;

  const maxCharsPerMessage = 75;
  let start = 0;

  while (start < helpMessage.length) {
    const end = Math.min(start + maxCharsPerMessage, helpMessage.length);
    sendChatMessage(helpMessage.slice(start, end));
    start = end;
  }
};

const keywordReactions = {
  'happy': '😊',
  'sad': '😔',
  'angry': '😠',
  'confused': '😕',
  'excited': '😄',
  'love': '❤️'
};

const reactToKeywords = (message) => {
  for (const keyword in keywordReactions) {
    if (message.toLowerCase().includes(keyword)) {
      sendChatMessage(keywordReactions[keyword]);
      break;
    }
  }
};

const handleEmojiRequest = (message) => {
  const emojiRequest = message.match(/^!emoji\s+(\w+)/i);
  if (emojiRequest && emojiRequest[1]) {
    const requestedEmoji = emojiRequest[1].toLowerCase();
    if (keywordReactions.hasOwnProperty(requestedEmoji)) {
      sendChatMessage(keywordReactions[requestedEmoji]);
    } else {
      sendChatMessage(`Sorry, I couldn't find the requested emoji.`);
    }
  }
};

let lastReactionTime = 0;
const reactionCooldown = 60 * 1000; // 1 minute

const canReact = () => {
  return Date.now() - lastReactionTime > reactionCooldown;
};

const tryReactToKeywords = (message) => {
  if (canReact()) {
    reactToKeywords(message);
    lastReactionTime = Date.now();
  }
};

let currentTriviaAnswer = null;

const handleScoreCheck = (username, message) => {
  if (message.startsWith(`${prefix}score`)) {
    const score = userScores[username] || 0;
    sendChatMessage(`${username}, your score is ${score}.`);
  }
};

const handleRequest = ({ command, username }) => {
  const currentTime = Date.now();
  if (currentTime - lastRequestTime[command] > 60 * 1000) {
    lastRequestTime[command] = currentTime;

    let response;
    if (command === 'topic') {
      const randomIndex = Math.floor(Math.random() * interestingTopics.length);
      response = `Here's an interesting topic for discussion: ${interestingTopics[randomIndex]}`;
    } else if (command === 'trivia') {
      const randomIndex = Math.floor(Math.random() * triviaQuestions.length);
      response = `Trivia question: ${triviaQuestions[randomIndex].question}`;
      currentTriviaAnswer = triviaQuestions[randomIndex].answer.toLowerCase();
    } else if (command === 'fact') {
      const randomIndex = Math.floor(Math.random() * interestingFacts.length);
      response = `Interesting fact: ${interestingFacts[randomIndex]}`;
    }

    sendChatMessage(`${username}, ${response}`);
  }
};


const handleMention = (username, message) => {
  const cleanedUsername = username.replace(/[\s\W]+/g, '');
  const mentionedSelf = new RegExp(`\\b${self}\\b`, 'i');

  if (mentionedSelf.test(message)) {
    const lastGreetedTime = lastGreeted[cleanedUsername] || 0;

    if (Date.now() - lastGreetedTime > 5 * 60 * 1000) {
      const randomResponse = someResponses[Math.floor(Math.random() * someResponses.length)];

      if (username !== self) {
        if(enableResonses) sendChatMessage(`${randomResponse}, ${cleanedUsername}!`);
		else console.log(`${randomResponse}, ${cleanedUsername}!`);
      }

      lastGreeted[cleanedUsername] = Date.now();
    }
  }
};

const greetUserOnJoin = (username) => {
  const cleanedUsername = username.replace(/[\s\W]+/g, '');
  const lastGreetedTime = lastGreeted[cleanedUsername] || 0;

  if (username !== self && Date.now() - lastGreetedTime > 2 * 60 * 1000) {
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    //sendChatMessage(`${randomGreeting}, ${username}!`);
    lastGreeted[cleanedUsername] = Date.now();
  }
};

const processedNodes = [];

const observer = new MutationObserver((mutationsList) => {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      const newMessages = mutation.addedNodes;
      for (let i = 0; i < newMessages.length; i++) {
        const message = newMessages[i];
        if (message.tagName === 'P' && message.dataset && message.dataset.t === 'c') {
          const usernameNode = message.querySelector('.nm');
          const messageNode = message.querySelector('.msg');
          if (usernameNode && messageNode) {
            const username = usernameNode.innerText;
            const messageText = messageNode.innerText;
            processMessage(username, messageText);
          }
        }
      }
    }
  }
});

const getMessageInfo = (node) => {
    const nameElement = node.querySelector('.nm.fcuser');
    const username = nameElement?.textContent;
    const uuid = nameElement?.dataset.uuid;
    const message = node.querySelector('.msg.fs_1')?.textContent;

    return { username, uuid, message };
};

const sendRandomTopic = () => {
  const randomIndex = Math.floor(Math.random() * interestingTopics.length);
  const randomTopic = interestingTopics[randomIndex];
  sendChatMessage(`Let's discuss an interesting topic: ${randomTopic}`);
};

const triviaQuestions = [
  // War
  {
    question: 'Which country did Germany invade, leading to the start of World War II?',
    answer: 'Poland',
    options: ['France', 'Poland', 'Austria', 'Czechoslovakia'],
  },
  {
    question: 'What was the longest battle of World War I?',
    answer: 'Battle of Verdun',
    options: ['Battle of the Somme', 'Battle of Jutland', 'Battle of Verdun', 'Battle of Passchendaele'],
  },
  // World
  {
    question: 'Which is the largest country by land area?',
    answer: 'Russia',
    options: ['Russia', 'Canada', 'United States', 'China'],
  },
  {
    question: 'What is the capital city of Spain?',
    answer: 'Madrid',
    options: ['Barcelona', 'Madrid', 'Valencia', 'Seville'],
  },
  // Military
  {
    question: 'What is the primary infantry weapon of the United States military?',
    answer: 'M4 Carbine',
    options: ['M16', 'M4 Carbine', 'AK-47', 'FN SCAR'],
  },
  {
    question: 'What type of aircraft is commonly known as a stealth bomber?',
    answer: 'B-2 Spirit',
    options: ['B-52 Stratofortress', 'B-1 Lancer', 'B-2 Spirit', 'F-117 Nighthawk'],
  },
  // Food
  {
    question: 'Which country is the origin of sushi?',
    answer: 'Japan',
    options: ['China', 'Japan', 'South Korea', 'Thailand'],
  },
  {
    question: 'What is the main ingredient in a traditional Greek moussaka?',
    answer: 'Eggplant',
    options: ['Eggplant', 'Potato', 'Zucchini', 'Cabbage'],
  },
  // Additional questions
  {
    question: 'Which city was besieged for 872 days during World War II?',
    answer: 'Leningrad',
    options: ['Stalingrad', 'Leningrad', 'Moscow', 'Berlin'],
  },
  {
    question: 'What was the name of the operation to land Allied forces in Normandy during World War II?',
    answer: 'Operation Overlord',
    options: ['Operation Torch', 'Operation Market Garden', 'Operation Overlord', 'Operation Barbarossa'],
  },
  {
    question: 'Which is the smallest country by land area?',
    answer: 'Vatican City',
    options: ['Monaco', 'Nauru', 'Tuvalu', 'Vatican City'],
  },
  {
    question: 'Which country has the most UNESCO World Heritage sites?',
    answer: 'Italy',
    options: ['France', 'Spain', 'Italy', 'China'],
  },
  {
    question: 'Which organization was awarded the Nobel Peace Prize in 2021?',
    answer: 'World Food Programme',
    options: ['United Nations', 'Doctors Without Borders', 'World Health Organization', 'World Food Programme'],
  },
  {
    question: 'What is the primary ingredient in a traditional Italian risotto?',
    answer: 'Rice',
    options: ['Rice', 'Pasta', 'Potatoes', 'Bread'],
  },
  // Psychological concepts
  {
    question: 'Who is known as the father of psychoanalysis?',
    answer: 'Sigmund Freud',
    options: ['Sigmund Freud', 'Carl Jung', 'Ivan Pavlov', 'B.F. Skinner'],
  },
  {
    question: 'What is the psychological phenomenon where people are less likely to help someone when others are present?',
    answer: 'Bystander effect',
    options: ['Bystander effect', 'Halo effect', 'Groupthink', 'Diffusion of responsibility'],
  },
  //random
{
  question: 'Which country has the longest coastline in the world?',
  answer: 'Canada',
  options: ['Russia', 'Canada', 'Indonesia', 'Greenland'],
},
{
  question: 'Which two countries share the longest international border?',
  answer: 'United States and Canada',
  options: ['United States and Mexico', 'Russia and China', 'India and China', 'United States and Canada'],
},
{
  question: 'Which planet in our solar system has the most moons?',
  answer: 'Jupiter',
  options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
},
{
  question: 'What is the smallest bone in the human body?',
  answer: 'Stapes',
  options: ['Stapes', 'Hammer', 'Anvil', 'Pisiform'],
},
{
  question: 'What is the chemical symbol for gold?',
  answer: 'Au',
  options: ['Ag', 'Au', 'Fe', 'Pb'],
},
{
  question: 'Which famous scientist developed the theory of general relativity?',
  answer: 'Albert Einstein',
  options: ['Isaac Newton', 'Albert Einstein', 'Niels Bohr', 'Galileo Galilei'],
},
{
  question: 'What is the tallest mountain in the world when measured from base to summit?',
  answer: 'Mauna Kea',
  options: ['Mount Everest', 'K2', 'Kangchenjunga', 'Mauna Kea'],
},
{
  question: 'Which river is the longest in the world?',
  answer: 'Nile',
  options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
},
{
  question: 'Which painter is famous for his series of paintings featuring water lilies?',
  answer: 'Claude Monet',
  options: ['Pierre-Auguste Renoir', 'Claude Monet', 'Vincent van Gogh', 'Paul Cézanne'],
},
{
  question: 'What is the most widely spoken language in the world?',
  answer: 'English',
  options: ['English', 'Chinese', 'Spanish', 'Hindi'],
},
{
  question: 'Which Italian city is famous for its Leaning Tower?',
  answer: 'Pisa',
  options: ['Rome', 'Venice', 'Florence', 'Pisa'],
},
{
  question: 'What is the national dish of Spain?',
  answer: 'Paella',
  options: ['Paella', 'Tapas', 'Gazpacho', 'Churros'],
},
{
  question: 'Which ancient civilization built the city of Machu Picchu?',
  answer: 'Inca',
  options: ['Maya', 'Aztec', 'Inca', 'Olmec'],
},
{
  question: 'Which planet is known as the "Red Planet"?',
  answer: 'Mars',
  options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
},
{
  question: 'What is the most abundant element in the Earth\'s atmosphere?',
  answer: 'Nitrogen',
  options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Argon'],
},
];

const lastRequestTime = {
  topic: 0,
  trivia: 0,
  fact: 0,
};

const userScores = {};

let currentTriviaQuestion = null;

const sendRandomTrivia = () => {
  const randomIndex = Math.floor(Math.random() * triviaQuestions.length);
  currentTriviaQuestion = triviaQuestions[randomIndex];
  sendChatMessage(
    `Trivia question: ${currentTriviaQuestion.question}\nOptions: ${currentTriviaQuestion.options.join(', ')}`
  );
};

const checkTriviaAnswer = (username, message) => {
  if (currentTriviaQuestion && message.toLowerCase().includes(currentTriviaQuestion.answer.toLowerCase())) {
    if (!userScores[username]) {
      userScores[username] = 0;
    }
    userScores[username]++;
    sendChatMessage(
      `Congratulations, ${username}! You got the correct answer. Your score is now ${userScores[username]}.`
    );
    currentTriviaQuestion = null;
  }
};





const inspirationalQuotes = [
  'The best way to predict the future is to create it. - Peter Drucker',
  'The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt',
  'It does not matter how slowly you go as long as you do not stop. - Confucius',
  'In the middle of every difficulty lies opportunity. - Albert Einstein',
  'Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill',
  'Believe you can and you are halfway there. - Theodore Roosevelt',
  'What lies behind us and what lies before us are tiny matters compared to what lies within us. - Ralph Waldo Emerson',
  'You miss 100% of the shots you don’t take. - Wayne Gretzky',
  'The only way to do great work is to love what you do. - Steve Jobs',
  'The only thing standing between you and your goal is the story you keep telling yourself as to why you can’t achieve it. - Jordan Belfort',
  'Don’t watch the clock; do what it does. Keep going. - Sam Levenson',
  'Start where you are. Use what you have. Do what you can. - Arthur Ashe',
  'Success is the sum of small efforts, repeated day in and day out. - Robert Collier',
  'The only place where success comes before work is in the dictionary. - Vidal Sassoon',
  'The harder you work for something, the greater you’ll feel when you achieve it. - Unknown',
  'Act as if what you do makes a difference. It does. - William James',
  'Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. - Albert Schweitzer',
  'Success is stumbling from failure to failure with no loss of enthusiasm. - Winston Churchill',
  'The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson',
  'The greatest mistake you can make in life is to be continually fearing you will make one. - Elbert Hubbard',
  'Success is liking yourself, liking what you do, and liking how you do it. - Maya Angelou',
  'The best revenge is massive success. - Frank Sinatra',
  'The road to success and the road to failure are almost exactly the same. - Colin R. Davis',
  'Failure will never overtake me if my determination to succeed is strong enough. - Og Mandino',
  'The biggest risk is not taking any risk. In a world that’s changing quickly, the only strategy that is guaranteed to fail is not taking risks. - Mark Zuckerberg',
  'Creativity is intelligence having fun. - Albert Einstein',
  'The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt',
  'The only way to discover the limits of the possible is to go beyond them into the impossible. - Arthur C. Clarke',
  'To succeed in life, you need two things: ignorance and confidence. - Mark Twain',
  'The power of imagination makes us infinite. - John Muir',
  'What we achieve inwardly will change outer reality. - Plutarch',
  'Do not go where the path may lead, go instead where there is no path and leave a trail. - Ralph Waldo Emerson',
  'The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart. - Helen Keller',
  'Innovation distinguishes between a leader and a follower. - Steve Jobs',
  'Your time is limited, don’t waste it living someone else’s life. - Steve Jobs',
  'The only way to achieve the impossible is to believe it is possible. - Charles Kingsleigh',
  'Life is not about finding yourself. Life is about creating yourself. - George Bernard Shaw',
  'The biggest adventure you can take is to live the life of your dreams. - Oprah Winfrey',
  'Dream, struggle, create, prevail. Be daring. Be brave. Be loving. Be compassionate. Be strong. Be brilliant. Be beautiful. - Caterina Fake',
  'Happiness is not something ready-made. It comes from your own actions. - Dalai Lama',
  'You can never cross the ocean until you have the courage to lose sight of the shore. - Christopher Columbus',
  'Believe in yourself! Have faith in your abilities! Without a humble but reasonable confidence in your own powers, you cannot be successful or happy. - Norman Vincent Peale',
  'Whatever you can do or dream you can, begin it. Boldness has genius, power, and magic in it. - Johann Wolfgang von Goethe',
  'The secret of getting ahead is getting started. - Mark Twain',
  'Every artist was first an amateur. - Ralph Waldo Emerson',
  'Creativity takes courage. - Henri Matisse',
  'Aim for the moon. If you miss, you may hit a star. - W. Clement Stone',
  'Logic will get you from A to B. Imagination will take you everywhere. - Albert Einstein',
  'It is never too late to be what you might have been. - George Eliot',
  'The biggest risk is not taking any risk. In a world that’s changing quickly, the only strategy that is guaranteed to fail is not taking risks. - Mark Zuckerberg',
  'The only thing worse than starting something and failing is not starting something. - Seth Godin',
  'Action is the foundational key to all success. - Pablo Picasso',
  'You must be the change you wish to see in the world. - Mahatma Gandhi',
  'The best way to find yourself is to lose yourself in the service of others. - Mahatma Gandhi',
  'Your big opportunity may be right where you are now. - Napoleon Hill',
  'Every moment is a fresh beginning. - T.S. Eliot',
  'An idea that is developed and put into action is more important than an idea that exists only as an idea. - Edward de Bono',
  'Life isn’t about waiting for the storm to pass, it’s about learning to dance in the rain. - Vivian Greene',
  'It is during our darkest moments that we must focus to see the light. - Aristotle Onassis',
  'Don’t judge each day by the harvest you reap, but by the seeds that you plant. - Robert Louis Stevenson',
  'The best way to predict the future is to invent it. - Alan Kay',
  'To accomplish great things, we must not only act, but also dream; not only plan, but also believe. - Anatole France',
  'The only thing that stands between you and your dream is the will to try and the belief that it is actually possible. - Joel Brown',
  'The two most important days in your life are the day you are born and the day you find out why. - Mark Twain',
  'It’s not about ideas. It’s about making ideas happen. - Scott Belsky',
  'If you are not willing to risk the usual, you will have to settle for the ordinary. - Jim Rohn',
  'The ones who are crazy enough to think they can change the world are the ones that do. - Steve Jobs',
  'The only way of discovering the limits of the possible is to venture a little way past them into the impossible. - Arthur C. Clarke',
  'The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb',
  'The only way to do great work is to love what you do. If you haven’t found it yet, keep looking. Don’t settle. - Steve Jobs',
  'There is no greater agony than bearing an untold story inside you. - Maya Angelou',
  'You were never created to live depressed, defeated, guilty, condemned, ashamed, or unworthy. You were created to be victorious. - Joel Osteen',
  'The only way to achieve the impossible is to believe it is possible. - Charles Kingsleigh',
  'The best way to succeed in this world is to act on the advice you give to others. - Unknown',
  'Life is not measured by the number of breaths we take, but by the moments that take our breath away. - Maya Angelou',
  'Be so good they can’t ignore you. - Steve Martin',
  'In order to succeed, we must first believe that we can. - Nikos Kazantzakis',
  'The best preparation for tomorrow is doing your best today. - H. Jackson Brown Jr.',
  'Great things never came from comfort zones. - Neil Strauss',
  'The harder I work, the luckier I get. - Samuel Goldwyn',
  'Do what you love and the money will follow. - Marsha Sinetar',
  'The true sign of intelligence is not knowledge but imagination. - Albert Einstein',
  'The most common way people give up their power is by thinking they don’t have any. - Alice Walker',
  'The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt',
  'The difference between ordinary and extraordinary is that little extra. - Jimmy Johnson',
  'The world is a book, and those who do not travel read only a page. - Saint Augustine',
  'The harder the conflict, the more glorious the triumph. - Thomas Paine',
  'The whole secret of a successful life is to find out what is one’s destiny to do, and then do it. - Henry Ford',
  'The only person you should try to be better than is the person you were yesterday. - Unknown',
  'The only way to get started is to quit talking and begin doing. - Walt Disney',
];

const sendRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
  const randomQuote = inspirationalQuotes[randomIndex];
  sendChatMessage(`Inspirational quote: ${randomQuote}`);
};

const interestingFacts = [
  'The tallest tree ever was an Australian eucalyptus – In 1872 it was measured at 435 feet tall.',
  'Honey never spoils – When sealed in an airtight container, honey is one of the few foods known to have an eternal shelf life.',
  'The longest recorded human lifespan is 122 years and 164 days.',
  'The Great Wall of China is over 13,000 miles long.',
  'There are more possible iterations of a game of chess than there are atoms in the known universe.',
  'There are over 7,000 languages spoken around the world today.',
  'The honeybee can recognize human faces.',
  'The tallest tree in the world, a coast redwood named Hyperion, is 379.7 feet tall.',
  'The total weight of all the ants on Earth is about the same as the total weight of all the humans on Earth.',
  'It takes about 8 minutes and 20 seconds for light to travel from the Sun to Earth.',
  'The largest known snowflake was 15 inches wide and 8 inches thick.',
  'The highest temperature ever recorded on Earth was 56.7°C (134°F) in Furnace Creek Ranch, Death Valley, California.',
  'The lowest temperature ever recorded on Earth was -89.2°C (-128.6°F) at the Soviet Union\'s Vostok Station in Antarctica.',
  'The deepest part of the ocean is the Challenger Deep in the Mariana Trench, reaching a depth of 36,070 feet.',
  'The Eiffel Tower can grow up to 6 inches taller during the summer due to thermal expansion of its iron structure.',
  'The smallest bone in the human body is the stapes bone in the ear, which is about the size of a grain of rice.',
  'The Earth\'s core is about as hot as the surface of the Sun.',
  'Jellyfish have been around for more than 500 million years, making them one of the oldest living creatures on Earth.',
  'The Andean mountain cat is one of the rarest and least-known cat species, with fewer than 2,500 individuals remaining in the wild.',
  'More than 80% of the Earth\'s ocean is unexplored and unmapped.',
  'The tongue is the only muscle in the human body that is attached at just one end.',
  'Sharks have been around for more than 400 million years, predating dinosaurs by more than 200 million years.',
  'The speed of a sneeze can be up to 100 miles per hour.',
  'The human nose can remember around 50,000 different scents.',
  'A single lightning bolt can heat the surrounding air to temperatures around 30,000 Kelvin, which is about five times hotter than the surface of the sun.',
  'Cows have best friends and can become stressed if they are separated.',
  'A bolt of lightning contains enough energy to toast around 100,000 slices of bread.',
  'There are more stars in the universe than there are grains of sand on all the beaches on Earth.',
  'The state sport of Maryland, USA is jousting, a medieval sport involving horse-mounted knights.',
  'The Earth\'s ozone layer will make a full recovery in about 50 years, according to scientific predictions.',
  'The average person will spend six months of their life waiting for red lights to turn green.',
  'Bananas are actually berries, while strawberries are not.',
  'Cleopatra lived closer in time to the invention of the iPhone than she did to the building of the Great Pyramid of Giza.',
  'The average cumulus cloud weighs around 1.1 million pounds.',
  'A day on Venus is longer than a year on Venus, as it takes 243 Earth days for Venus to rotate once on its axis, while it takes 225 Earth days for Venus to orbit the Sun.',
  'Approximately 70% of the oxygen we breathe is produced by the ocean, primarily by marine plants and phytoplankton.',
  'The shortest war in history was between Britain and Zanzibar in 1896, lasting only 38 to 45 minutes.',
  'The Rubik’s Cube, invented in 1974, is the world\'s best-selling toy with over 350 million units sold worldwide.',
  'In 1958, the United States sent a grapefruit-sized satellite named SCORE into orbit, making it the world\'s first communications satellite.',
  'There is a mammal known as the "pen-tailed tree shrew" that consumes fermented nectar with an alcohol content equivalent to beer on a nightly basis, yet shows no signs of intoxication.',
  'The oldest known sample of the smallpox virus was found in the teeth of a 17th-century child buried in Lithuania.',
  'The world\'s smallest mammal is the bumblebee bat, weighing in at just about 2 grams and measuring about 1.1 inches in length.',
  'The word "nerd" was first coined by Dr. Seuss in his 1950 book "If I Ran the Zoo".',
  'In 2005, a fortune cookie company called Wonton Food Inc. correctly foretold lottery numbers, resulting in 110 winners and an investigation. No fraud was found.',
  'The national animal of Scotland is the unicorn.',
  'Cats are believed to be responsible for the extinction of at least 63 species of birds, mammals, and reptiles.',
  'A group of pugs is called a "grumble".',
  'A "jiffy" is an actual unit of time equal to 1/100th of a second.',
  'The word "gullible" is not in the dictionary. (Note: It actually is, but this fact is a humorous play on the concept of gullibility.)',
  'The average person walks the equivalent of five times around the world in their lifetime.',
  'Banging your head against a wall burns around 150 calories per hour.',
  'The inventor of the Pringles can, Fredric Baur, had his ashes buried in a Pringles can after he passed away in 2008.',
  'A strawberry isn\'t a true berry, but a banana is.',
  'You can\'t hum while holding your nose closed.',
  'The word "bed" looks like a bed.',
  'Polar bears have black skin to help them absorb and retain heat from the sun, despite their white fur.',
  'The dot above the letter "i" and "j" is called a "tittle".',
  'The term "Bluetooth" is derived from the name of a 10th-century Danish king, Harald Bluetooth, who united Denmark and Norway. It symbolizes the connection of different devices.',
  'In ancient Greece, throwing an apple at someone was considered a marriage proposal.',
  'A pound of houseflies contains more protein than a pound of beef.',
  'The word "queue" is the only word in the English language that is still pronounced the same way when the last four letters are removed.',
  'There is an uninhabited island in the Bahamas known as "Pig Beach," which is populated entirely by swimming pigs.',
];

const sendRandomFact = () => {
  const randomIndex = Math.floor(Math.random() * interestingFacts.length);
  const randomFact = interestingFacts[randomIndex];
  sendChatMessage(`Here is a fun Fact: ${randomFact}`);
};

const wordsOfTheDay = [
  { word: 'Petrichor', definition: 'The pleasant smell that frequently accompanies the first rain after a long period of warm, dry weather.', },
  { word: 'Serendipity', definition: 'The occurrence and development of events by chance in a happy or beneficial way.', },
  { word: 'Ephemeral', definition: 'Lasting for a very short time.', },
  { word: 'Limerence', definition: 'The state of being infatuated or obsessed with another person, typically experienced involuntarily and characterized by a strong desire for reciprocation of one\'s feelings.', },
  { word: 'Sonorous', definition: 'Capable of producing a deep or ringing sound.', },
  { word: 'Quixotic', definition: 'Exceedingly idealistic; unrealistic and impractical.', },
  { word: 'Nefarious', definition: 'Wicked or criminal.', },
  { word: 'Susurrus', definition: 'A soft murmuring or rustling sound; a whisper.', },
  { word: 'Obfuscate', definition: 'To render obscure, unclear, or unintelligible.', },
  { word: 'Mellifluous', definition: 'A sound that is sweet or musical; pleasant to hear.', },
  { word: 'Sesquipedalian', definition: 'A person who uses long words or a word containing many syllables.', },
  { word: 'Bucolic', definition: 'Relating to the pleasant aspects of the countryside and country life.', },
  { word: 'Ineffable', definition: 'Too great or extreme to be expressed or described in words.', },
  { word: 'Pulchritudinous', definition: 'Physically beautiful; comely.', },
  { word: 'Crepuscular', definition: 'Relating to or resembling twilight; active in the twilight.', },
  { word: 'Voracious', definition: 'Wanting or devouring great quantities of food; having a very eager approach to an activity.', },
  { word: 'Sanguine', definition: 'Optimistic or positive, especially in an apparently bad or difficult situation.', },
  { word: 'Dulcet', definition: 'Sweet and soothing, often used to describe a sound.', },
  { word: 'Lugubrious', definition: 'Looking or sounding sad and dismal.', },
  { word: 'Cacophony', definition: 'A harsh, discordant mixture of sounds.', }
];


const sendRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * wordsOfTheDay.length);
  const randomWord = wordsOfTheDay[randomIndex];
  sendChatMessage(`Word of the day: ${randomWord.word} - ${randomWord.definition}`);
};

const randomResponseFunctions = [sendRandomTopic, sendRandomTrivia, sendRandomQuote, sendRandomFact, sendRandomWord];

const sendRandomResponse = () => {
  const randomIndex = Math.floor(Math.random() * randomResponseFunctions.length);
  randomResponseFunctions[randomIndex]();
};

setInterval(sendRandomResponse, 7 * 60 * 1000);



const eightBallResponses = [
    'It is certain', 'It is decidedly so', 'Without a doubt', 'Yes, definitely',
    'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good',
    'Yes', 'Signs point to yes', 'Reply hazy, try again', 'Better not tell you now',
    'Ask again later', 'Cannot predict now', 'Concentrate and ask again', 'Don’t count on it',
    'Outlook not so good', 'My sources say no', 'Very doubtful', 'My reply is no'
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
	'What’s the deal?', 'What’s the story?', 'What’s the news?', 'What’s the gossip?'];

const someResponses = [
  'Hey, what can I do for you?',
  'You called?',
  'Did someone mention me?',
  'How can I help you?',
  'What\'s up?',
  'Yes, I\'m here!'
];

const interestingTopics = [
  'Artificial Intelligence',
  'Space Exploration',
  'Virtual Reality',
  'Climate Change',
  'Quantum Computing',
  'Blockchain Technology',
  'Self-Driving Cars',
  'Gene Editing',
  'Renewable Energy',
  '3D Printing',
  'Nanotechnology',
  'Robotics',
  'Biotechnology',
  'Smart Cities',
  'Gaming Industry',
  'Electric Vehicles',
  'Internet of Things',
  'Neural Networks',
  'Data Privacy',
  'Machine Learning',
  'Augmented Reality',
  'Telemedicine',
  'E-Commerce',
  'Globalization',
  'Cybersecurity',
  'Cryptocurrency',
  'Drones',
  'Social Media',
  'Online Education',
  'Biohacking',
  'Sustainable Living',
  'Wearable Tech',
  'Dark Matter',
  'Alternative Energy Sources',
  'Immersive Media',
  'Digital Art',
  'Biomimicry',
  'Future of Work',
  'Internet Censorship',
  'Artificial Photosynthesis',
  'Fusion Power',
  'Online Privacy',
  'Artificial Organs',
  'Human-Animal Hybrids',
  'Brain-Computer Interfaces',
  'Smart Materials',
  'Synthetic Biology',
  'Regenerative Medicine'
];



observer.observe(chatbox, { childList: true, subtree: true });
});
})();