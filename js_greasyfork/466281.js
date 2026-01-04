// ==UserScript==
// @name         TriviaBotv0.3
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  A script to listen to chat messages and respond to a specific prefix
// @author       BadNintendo
// @match        https://www.shutdown.chat/*/*
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_listValues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466281/TriviaBotv03.user.js
// @updateURL https://update.greasyfork.org/scripts/466281/TriviaBotv03.meta.js
// ==/UserScript==

(function() {
    'use strict';
const prefix = '!';
const enableCommands = false;
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


const triviaQuestions = [
  { question: 'What is the world’s smallest mammal?', options: ['Pygmy Mouse', 'Bumblebee Bat', 'Pygmy Marmoset', 'Dwarf Lemur'], answer: 'Bumblebee Bat' },
  { question: 'The Goliath birdeater is a type of what?', options: ['Spider', 'Bird', 'Lizard', 'Bat'], answer: 'Spider' },
  { question: 'What is the heaviest insect in the world?', options: ['Goliath Beetle', 'Titan Beetle', 'Giant Weta', 'Atlas Moth'], answer: 'Giant Weta' },
  { question: 'The kakapo is a rare species of what animal?', options: ['Lizard', 'Bird', 'Mammal', 'Insect'], answer: 'Bird' },
  { question: 'What rare marine creature is known as the "Unicorn of the Sea"?', options: ['Sea Dragon', 'Narwhal', 'Giant Squid', 'Manatee'], answer: 'Narwhal' },
  { question: 'Who directed the movie "Inception"?', options: ['Christopher Nolan', 'Steven Spielberg', 'Quentin Tarantino', 'Martin Scorsese'], answer: 'Christopher Nolan' },
  { question: 'What is the name of the main character in "The Matrix"?', options: ['Neo', 'Morpheus', 'Trinity', 'Agent Smith'], answer: 'Neo' },
  { question: 'Which movie features the quote, "I\'m king of the world!"?', options: ['Titanic', 'The Lion King', 'King Kong', 'The Lord of the Rings'], answer: 'Titanic' },
  { question: 'Who played the Joker in "The Dark Knight"?', options: ['Heath Ledger', 'Jack Nicholson', 'Jared Leto', 'Joaquin Phoenix'], answer: 'Heath Ledger' },
  { question: 'What is the highest-grossing film of all time?', options: ['Avatar', 'Avengers: Endgame', 'Titanic', 'Star Wars: The Force Awakens'], answer: 'Avengers: Endgame' },
  { question: 'What is the capital of France?', options: ['Paris', 'London', 'Berlin', 'Tokyo'], answer: 'Paris' },
  {
	  question: 'Which is the largest species of shark?',
	  options: ['Great White Shark', 'Tiger Shark', 'Whale Shark', 'Hammerhead Shark'],
	  answer: 'Whale Shark'
	},
	{
	  question: 'What is the world’s fastest land animal?',
	  options: ['Cheetah', 'Lion', 'Pronghorn Antelope', 'Greyhound'],
	  answer: 'Cheetah'
	},
	{
	  question: 'What bird is known as a symbol of peace?',
	  options: ['Dove', 'Swan', 'Sparrow', 'Peacock'],
	  answer: 'Dove'
	},
	{
	  question: 'Which insect is known to light up?',
	  options: ['Firefly', 'Beetle', 'Cicada', 'Dragonfly'],
	  answer: 'Firefly'
	},
	{
	  question: 'Which animal is known to change its color?',
	  options: ['Chameleon', 'Gecko', 'Iguana', 'Komodo Dragon'],
	  answer: 'Chameleon'
	},
	{
	  question: 'What is the largest species of penguin?',
	  options: ['Emperor Penguin', 'King Penguin', 'Gentoo Penguin', 'Adélie Penguin'],
	  answer: 'Emperor Penguin'
	},
	{
	  question: 'What rare animal is known as the "Asian Unicorn"?',
	  options: ['Saola', 'Komodo Dragon', 'Red Panda', 'Snow Leopard'],
	  answer: 'Saola'
	},
	{
	  question: 'Which insect migrates the longest distance?',
	  options: ['Monarch Butterfly', 'Locust', 'Dragonfly', 'Beetle'],
	  answer: 'Monarch Butterfly'
	},
	{
	  question: 'What is the only mammal that is capable of sustained flight?',
	  options: ['Bat', 'Flying Squirrel', 'Sugar Glider', 'Colugo'],
	  answer: 'Bat'
	},
	{
	  question: 'What is the largest planet in our solar system?',
	  options: ['Jupiter', 'Saturn', 'Earth', 'Mars'],
	  answer: 'Jupiter'
	},
	{
	  question: 'Who was the first person to walk on the moon?',
	  options: ['Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'Michael Collins'],
	  answer: 'Neil Armstrong'
	},
	{
	  question: 'What is the closest star to Earth?',
	  options: ['Alpha Centauri', 'Betelgeuse', 'Proxima Centauri', 'Sirius'],
	  answer: 'Proxima Centauri'
	},
	{
	  question: 'What galaxy is Earth located in?',
	  options: ['Andromeda', 'Milky Way', 'Whirlpool', 'Triangulum'],
	  answer: 'Milky Way'
	},
	{
	  question: 'What is the name of the NASA rover that landed on Mars in 2021?',
	  options: ['Curiosity', 'Perseverance', 'Spirit', 'Opportunity'],
	  answer: 'Perseverance'
	},
	{
	  question: 'Which planet is known as the "Red Planet"?',
	  options: ['Mars', 'Venus', 'Mercury', 'Jupiter'],
	  answer: 'Mars'
	},
	{
	  question: 'How long does it take for light from the Sun to reach Earth?',
	  options: ['8 seconds', '8 minutes', '8 hours', '8 days'],
	  answer: '8 minutes'
	},
	{
	  question: 'What is the largest moon in the Solar System?',
	  options: ['Titan', 'Ganymede', 'Europa', 'Callisto'],
	  answer: 'Ganymede'
	},
	{
	  question: 'What is the hottest planet in our solar system?',
	  options: ['Mercury', 'Venus', 'Mars', 'Jupiter'],
	  answer: 'Venus'
	},
	{
	  question: 'What does "www" stand for in a website address?',
	  options: ['World Wide Web', 'Web Wide World', 'World Web Wide', 'Web World Wide'],
	  answer: 'World Wide Web'
	},
	{
	  question: 'Who is considered the "Father of the Internet"?',
	  options: ['Bill Gates', 'Vint Cerf', 'Steve Jobs', 'Tim Berners-Lee'],
	  answer: 'Vint Cerf'
	},
	{
	  question: 'What was the first ever search engine on the Internet?',
	  options: ['Google', 'Yahoo', 'Archies', 'Bing'],
	  answer: 'Archies'
	},
	{
	  question: 'Which was the first social networking site?',
	  options: ['Facebook', 'Twitter', 'LinkedIn', 'SixDegrees.com'],
	  answer: 'SixDegrees.com'
	},
	{
	  question: 'Which company was established on April 1st, 1976 by Steve Jobs, Steve Wozniak and Ronald Wayne?',
	  options: ['Microsoft', 'Atari', 'Commodore', 'Apple'],
	  answer: 'Apple'
	},
	{
	  question: 'What does "URL" stand for?',
	  options: ['Universal Resource Locator', 'Uniform Resource Locator', 'Uniform Retrieval Locator', 'Universal Retrieval Locator'],
	  answer: 'Uniform Resource Locator'
	},
	{
	  question: 'What is the main difference between HTTP and HTTPS?',
	  options: ['Speed', 'Security', 'Hyperlink', 'Transfer Rate'],
	  answer: 'Security'
	},
	{
	  question: 'What was the first widely used browser?',
	  options: ['Internet Explorer', 'Mozilla Firefox', 'Google Chrome', 'Netscape Navigator'],
	  answer: 'Netscape Navigator'
	},
	{
	  question: 'What does "HTML" stand for?',
	  options: ['Hyperlinks and Text Markup Language', 'Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Mark Language'],
	  answer: 'Hyper Text Markup Language'
	},
// Advanced animal trivia
  {
    question: 'Which bird species has the largest wingspan?',
    options: ['Andean Condor', 'Southern Royal Albatross', 'Wandering Albatross', 'Dalmatian Pelican'],
    answer: 'Wandering Albatross'
  },
  {
    question: 'Which animal has the longest lifespan?',
    options: ['Bowhead Whale', 'Galapagos Giant Tortoise', 'Greenland Shark', 'Ocean Quahog'],
    answer: 'Greenland Shark'
  },

  // Advanced movie trivia
  {
    question: 'Which film won the first ever Academy Award for Best Picture?',
    options: ['The Broadway Melody', 'Wings', 'All Quiet on the Western Front', 'Cimarron'],
    answer: 'Wings'
  },
  {
    question: 'Which actor has won the most Academy Awards for Best Actor?',
    options: ['Jack Nicholson', 'Daniel Day-Lewis', 'Tom Hanks', 'Marlon Brando'],
    answer: 'Daniel Day-Lewis'
  },

  // Advanced space trivia
  {
    question: 'What is the name of the most distant galaxy ever observed?',
    options: ['Andromeda', 'GN-z11', 'IC 1101', 'Tadpole Galaxy'],
    answer: 'GN-z11'
  },
  {
    question: 'What is the estimated number of galaxies in the observable universe?',
    options: ['2 billion', '100 billion', '200 billion', '2 trillion'],
    answer: '2 trillion'
  },

  // Advanced internet trivia
  {
    question: 'What does the 404 error status code mean in HTTP?',
    options: ['Forbidden', 'Internal Server Error', 'Not Found', 'Bad Request'],
    answer: 'Not Found'
  },
  {
    question: 'What was the first registered domain name?',
    options: ['symbolics.com', 'ibm.com', 'microsoft.com', 'cisco.com'],
    answer: 'symbolics.com'
  },
  // Advanced biology trivia
  {
    question: 'What is the longest type of cell in the human body?',
    options: ['Neuron', 'Muscle cell', 'Skin cell', 'Red blood cell'],
    answer: 'Neuron'
  },
  {
    question: 'What enzyme is responsible for DNA replication in cells?',
    options: ['Ligase', 'Topoisomerase', 'Polymerase', 'Helicase'],
    answer: 'Polymerase'
  },

  // Advanced history trivia
  {
    question: 'Who was the longest reigning British monarch before Queen Elizabeth II?',
    options: ['Queen Victoria', 'King George III', 'King James VI and I', 'Queen Elizabeth I'],
    answer: 'Queen Victoria'
  },
  {
    question: 'Which civilization is known as the "Cradle of Civilization"?',
    options: ['Roman Civilization', 'Mesopotamian Civilization', 'Ancient Egyptian Civilization', 'Indus Valley Civilization'],
    answer: 'Mesopotamian Civilization'
  },

  // Advanced physics trivia
  {
    question: 'What does the Heisenberg Uncertainty Principle state?',
    options: ['The position and momentum of a particle cannot both be precisely measured at the same time.', 'Energy and time are inversely proportional.', 'The state of a particle in a quantum superposition remains unchanged until it interacts with an observer.', 'The speed of light is the ultimate speed limit in the universe.'],
    answer: 'The position and momentum of a particle cannot both be precisely measured at the same time.'
  },
  {
    question: 'Who proposed the theory of General Relativity?',
    options: ['Isaac Newton', 'Albert Einstein', 'Niels Bohr', 'Max Planck'],
    answer: 'Albert Einstein'
  },

  // Advanced literature trivia
  {
    question: 'Who wrote "One Hundred Years of Solitude"?',
    options: ['Gabriel García Márquez', 'Ernest Hemingway', 'Mark Twain', 'F. Scott Fitzgerald'],
    answer: 'Gabriel García Márquez'
  },
  {
    question: 'In which century was "The Canterbury Tales" written?',
    options: ['14th century', '16th century', '17th century', '19th century'],
    answer: '14th century'
  },
];

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

const processMessageAndGreet = ({ username, message }) => {
  const cleanedUsername = username.replace(/[\s\W]+/g, '');
  
  if (message.startsWith(prefix)) {
    const command = message.slice(1);

    if(enableCommands) {
      handleEightBallQuestion({ message });
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

const observer = new MutationObserver((mutations) => {
  mutations.forEach(({ addedNodes }) => {
    addedNodes.forEach((node) => {
      if (node.tagName === 'P') {
        handleUserJoin(node);
        const { username, message } = getMessageInfo(node);
        if (username && message) {
          handleAnswer({ username, message });
        }
      }
    });
  });
});

const getMessageInfo = (node) => {
    const nameElement = node.querySelector('.nm.fcuser');
    const username = nameElement?.textContent;
    const uuid = nameElement?.dataset.uuid;
    const message = node.querySelector('.msg.fs_1')?.textContent;

    return { username, uuid, message };
};

let lastAskedQuestion = null;
let lastAskedTime = 0;
let currentAnswer = null;
let attempts = {};
let lastAttemptTime = {};
let userAnswers = {};
let isBonusRound = false;
const PENALTY_TIME = 2 * 60 * 1000;
let points = {};
let currentOptions = null;


Object.keys(GM_listValues()).forEach(username => {
  points[username] = GM_getValue(username, 0);
});


const handleTriviaQuestion = () => {
  if (Date.now() - lastAskedTime < 4 * 60 * 60 * 1000) {
    return;
  }

  let question;
  do {
    question = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
  } while (question === lastAskedQuestion);

  lastAskedQuestion = question;
  lastAskedTime = Date.now();
  currentAnswer = question.answer;
  currentOptions = question.options;  // Set currentOptions to the options for the current question

  sendChatMessage(`Trivia question: ${question.question} Options: ${question.options.join(', ')}`);

  const isBonus = Math.random() < 0.1;
  if (isBonus) {
    isBonusRound = true;
    sendChatMessage('Bonus round! Points are doubled for this question!');
  } else {
    isBonusRound = false;
  }
};


function cleanAnswer(answer) {
  return answer.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\[\]]/g,"").toLowerCase().trim();
}

const handleAnswer = ({ username, message }) => {
  // Only process answer if a question has been asked and not answered yet
  if (currentAnswer && username !== self && enableGames) {
    // Check if the user's message is a potential answer
    if (currentOptions.includes(cleanAnswer(message))) {
      if (!attempts[username]) {
        attempts[username] = 0;
      }

      if (!lastAttemptTime[username]) {
        lastAttemptTime[username] = 0;
      }

      if (!userAnswers[username]) {
        userAnswers[username] = [];
      }

      if (Date.now() - lastAttemptTime[username] < 30 * 1000) {
        sendChatMessage(`Please wait a while before submitting another answer, ${username}.`);
        return;
      }

      if (userAnswers[username].includes(cleanAnswer(message))) {
        sendChatMessage(`You've already submitted that answer, ${username}. Try something else.`);
        return;
      }

      userAnswers[username].push(cleanAnswer(message));
      lastAttemptTime[username] = Date.now();

      if (attempts[username] >= 3) {
        sendChatMessage(`You've reached the maximum number of attempts for this question, ${username}.`);
        return;
      }
      
      attempts[username]++;

      if (cleanAnswer(message) === cleanAnswer(currentAnswer)) {
        const pointsMultiplier = isBonusRound ? 2 : 1;
        points[username] = (points[username] || 0) + 1 * pointsMultiplier;
        let userPoints = GM_getValue(username, 0);
        userPoints += 1 * pointsMultiplier;
        GM_setValue(username, userPoints);
        sendChatMessage(`Congratulations, ${username}! You now have ${userPoints} point(s).`);
        currentAnswer = null;
        lastAskedQuestion = null;
        attempts[username] = 0;
        userAnswers[username] = []; 
      } else if (attempts[username] === 3) {
        lastAttemptTime[username] = Date.now() + PENALTY_TIME;
        sendChatMessage(`Sorry, ${username}, that's incorrect. You're on a timeout for ${PENALTY_TIME / 60000} minutes.`);
      }

      updateLeaderboard();
    }
  }
};

const updateLeaderboard = () => {
  const sortedUsers = Object.keys(points).sort((a, b) => points[b] - points[a]);
  let leaderboardMessage = 'Leaderboard:\n';
  sortedUsers.forEach((user, index) => {
    leaderboardMessage += `${index + 1}. ${user}: ${points[user]} point(s)\n`;
  });
  sendChatMessage(leaderboardMessage);
};

setInterval(handleTriviaQuestion, 7 * 60 * 1000);

observer.observe(chatbox, {
  childList: true,
  subtree: true,
  characterData: true
});
})();